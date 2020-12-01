import request from './request';
import requestMultipart from './requestMultipart';

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
   * Изменение данных пользователя
   */
  updateUser: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/user', 'PUT', context.args.body);
    },
  },
  /**
   * Получение админом данных пользователя
   */
  getUser: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request(`/user/${context.args.id}`, 'GET', context.args.body);
    },
  },
  /**
   * Получение админом данных пользователей
   */
  getUsers: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/user/admin', 'GET', context.args.params);
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
  /**
   * Получение кампаний
   */
  getCampaigns: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/campaign/get', 'POST', context.args.body);
    },
  },
  /**
   * Изменение статуса кампании
   */
  changeCampaignStatus: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request(`/campaign/status/${context.args.id}`, 'PUT', context.args.body);
    },
  },
  /**
   * Создание кампании
   */
  createCampaign: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/campaign', 'POST', context.args.body);
    },
  },
  /**
   * поиск страны
   */
  searchCoutries: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/countries', 'GET', context.args.params);
    },
  },
  /**
   * Получение офферов
   */
  getOffers: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/offer/get', 'POST', context.args.body);
    },
  },
  /**
   * Создание оффера
   */
  createOffer: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request('/offer', 'POST', context.args.body);
    },
  },
  /**
   * Изменение/добавление иконки оффера
   */
  uploadIcon: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return requestMultipart(`/offer/icon/${context.args.id}`, context.args.body);
    },
  },
  /**
   * Изменение/добавление изображения оффера
   */
  uploadImage: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return requestMultipart(`/offer/image/${context.args.id}`, context.args.body);
    },
  },
  /**
   * Изменение/добавление изображения оффера
   */
  deleteCampaign: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request(`/campaign/${context.args.id}`, 'DELETE');
    },
  },
  /**
   * Получение кампании по ид
   */
  getCampaign: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request(`/campaign/${context.args.id}`, 'GET');
    },
  },
  /**
   * Изменение оффера
   */
  updateOffer: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request(`/offer/${context.args.id}`, 'PUT', context.args.body);
    },
  },
  /**
   * Изменение кампании
   */
  updateCampaign: {
    context: this,
    // eslint-disable-next-line no-unused-vars
    fn: (context: any, ...args: any[]): any => {
      return request(`/campaign/${context.args.id}`, 'PUT', context.args.body);
    },
  },
};

export default Api;
