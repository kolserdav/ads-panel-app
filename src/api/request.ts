/**
 *  Метод запросов на сервер
 */
import * as lib from '../lib';
import * as Types from '../react-app-env';

const { REACT_APP_SERVER_URL } = process.env;

export default function request(
  path: string,
  method: Types.RequestMethods,
  token: string,
  paramBody: any = null
): Promise<Types.ServerResponse> {
  return new Promise((resolve, reject) => {
    const params: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'xx-auth': token,
      },
    };
    if (paramBody && method !== 'GET') {
      params.body = JSON.stringify(paramBody);
    }
    let query = '';
    if (paramBody && method === 'GET') {
      query = lib.stringifyQuery(paramBody);
    }
    fetch(`${REACT_APP_SERVER_URL}${path}${query}`, params)
      .then((r: any) => r.json())
      .then((data: any) => {
        resolve(data);
      })
      .catch((e: Error) => {
        if (process.env.NODE_ENV === 'development') throw e;
        reject(e);
      });
  });
}
