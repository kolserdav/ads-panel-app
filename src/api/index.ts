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
      return request('/user/session', 'GET');
    },
  },
  /**
   * Вход пользователя
   */
  login: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      // Если GET запрос то params в остальных body
      return request('/user/login', 'POST', context.args.body);
    },
  },
  /**
   * Регистрация пользователя
   */
  register: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/user', 'POST', context.args.body);
    },
  },
  /**
   * Подтверждение почты
   */
  confirm: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/user/confirm', 'GET', context.args.params);
    },
  },
  /**
   * Запрос на существование почты
   */
  getEmail: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/user/forgot', 'POST', context.args.body);
    },
  },
  /**
   * Смена паролей
   */
  changePasword: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/user/pass', 'PUT', context.args.body, context.args.token);
    },
  },
  /**
   * Запрос статистики для графика
   */
  statGraph: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/statistic/graph', 'POST', context.args.body);
    },
  },
  /**
   * Запрос статистики для таблицы
   */
  statTable: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/statistic/table', 'POST', context.args.body);
    },
  },
};

export default Api;
