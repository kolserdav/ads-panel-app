/**
 *  Метод запросов на сервер
 */
import { Cookies } from 'react-cookie';
import * as lib from '../lib';
import * as Types from '../react-app-env';

const cookies = new Cookies();

const { REACT_APP_SERVER_URL } = process.env;

export default function request(
  path: string,
  method: Types.RequestMethods,
  paramBody: any = null,
  token: string = ''
): Promise<Types.ServerResponse> {
  const jwtToken = cookies.get('_qt');
  return new Promise((resolve, reject) => {
    const params: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'xx-auth': jwtToken, // В большинстве запросов токен будет JWT
        'xx-token': token, // В таких запросах как смена пароля токет base64 временной метки
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
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV === 'development') console.error(e);
        reject(e);
      });
  });
}
