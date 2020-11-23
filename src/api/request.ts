/**
 *  Метод запросов на сервер
 */

import * as Types from '../react-app-env';

const { REACT_APP_SERVER_URL } = process.env;

export default function request(
  path: string,
  method: Types.RequestMethods,
  token: string
): Promise<Types.ServerResponse> {
  return new Promise((resolve, reject) => {
    fetch(`${REACT_APP_SERVER_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'xx-auth': token,
      },
    })
      .then((r: any) => r.json())
      .then((data: any) => {
        resolve(data);
      })
      .catch((e: Error) => {
        reject(e);
      });
  });
}
