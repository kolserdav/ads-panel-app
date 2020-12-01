/**
 *  Метод отправки изображений на сервер
 */
import { Cookies } from 'react-cookie';
import * as Types from '../react-app-env';

const cookies = new Cookies();

const { REACT_APP_SERVER_URL, REACT_APP_SERVER_URL_LOCAL, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const serverUrl = dev ? REACT_APP_SERVER_URL_LOCAL : REACT_APP_SERVER_URL;

export default function requestMultipart(
  path: string,
  paramBody: any = null,
): Promise<Types.ServerResponse> {
  const jwtToken = cookies.get('_qt');
  return new Promise((resolve, reject) => {
    const params: any = {
      method: 'POST',
      headers: {
        'xx-auth': jwtToken, // В большинстве запросов токен будет JWT
      },
      body: paramBody,
    };
    fetch(`${serverUrl}${path}`, params)
      .then((r: any) => r.json())
      .then((data: any) => {
        resolve(data);
      })
      .catch((e: Error) => {
        // eslint-disable-next-line no-console
        if (dev) console.error(e);
        reject(e);
      });
  });
}