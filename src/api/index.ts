import request from './request';

/**
 * Все методы Api получают следующие параметры
 * @param context {Types.Action} - то что передается из компонента
 * @param args - {any[]} - то что передается из посредника в методe call, третьим агруметном.
 */
const Api = {
  /**
   * Получение данных пользователя
   */
  fetchUser: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/user/session', 'GET', context.args.token);
    },
  },
};

export default Api;
