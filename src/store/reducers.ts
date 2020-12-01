/**
 * Единый файл редьюсеров,
 * просто экспортирует набор типов обращений к хранилищу.
 */

import Types from '../react-app-env';

// Вид структуры данных, которые хрангят ответы от сервера
const initialData: Types.Reducer = {
  type: 'INITIAL_TYPE',
  initialData: {
    type: 'INITIAL_TYPE',
    data: {
      result: 'wait',
      message: 'no data',
      body: {},
    },
  },
};

const initialState: any = {
  type: 'INITIAL_TYPE',
  data: initialData,
};

// Один редьюсер на все кейсы
export default function appReducer(state = initialState, action: Types.Action): Types.Reducer {
  // Здесь не работает проверка типа Reducer возможно из-за дефолтного возврата any, TODO что делать?
  let copyState: any = {};
  switch (action.type) {
    /**
     * Получение сессии
     */
    case 'USER_FETCH_REQUESTED':
      // Меняем стартовые данные в state, чтобы отслеживать последнее событие
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      // Объединяем измененные стартовые данные и данные полученные от хранилища по ключу события
      return Object.assign(copyState, {
        userData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'USER_FETCH_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        userData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'USER_FETCH_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        userData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Изменение данных пользователя
     */
    case 'USER_UPDATE_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        userUpdateData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'USER_UPDATE_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        userUpdateData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'USER_UPDATE_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        userUpdateData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Получение админом данных пользователя
     */
    case 'USER_FETCH_ADMIN_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        userFetchAdminData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'USER_FETCH_ADMIN_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        userFetchAdminData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'USER_FETCH_ADMIN_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        userFetchAdminData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Получение админом данных пользователей
     */
    case 'USERS_FETCH_ADMIN_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        usersFetchAdminData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'USERS_FETCH_ADMIN_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        usersFetchAdminData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'USERS_FETCH_ADMIN_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        usersFetchAdminData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Вход пользователя
     */
    case 'LOGIN_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        loginData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'LOGIN_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        loginData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'LOGIN_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        loginData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Регистрация пользователя
     */
    case 'REGISTRATION_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        registerData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'REGISTRATION_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        registerData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'REGISTRATION_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        registerData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Подтверждение почты
     */
    case 'CONFIRM_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        confirmData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'CONFIRM_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        confirmData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'CONFIRM_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        confirmData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Проверка почты
     */
    case 'EMAIL_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        emailData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'EMAIL_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        emailData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'EMAIL_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        emailData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Смена пароля
     */
    case 'CHANGE_PASS_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        passData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'CHANGE_PASS_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        passData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'CHANGE_PASS_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        passData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Получение статистики графика
     */
    case 'GRAPH_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        graphData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'GRAPH_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        graphData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'GRAPH_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        graphData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Получение статистики таблицы
     */
    case 'TABLE_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        tableData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'TABLE_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        tableData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'TABLE_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        tableData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Получение кампаний
     */
    case 'GET_CAMPAIGNS_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        getCampaignsData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'GET_CAMPAIGNS_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        getCampaignsData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'GET_CAMPAIGNS_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        getCampaignsData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Изменение статуса кампании
     */
    case 'CHANGE_CAMPAIGN_STATUS_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        changeCampaignStatusData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'CHANGE_CAMPAIGN_STATUS_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        changeCampaignStatusData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'CHANGE_CAMPAIGN_STATUS_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        changeCampaignStatusData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Создание кампании
     */
    case 'CREATE_CAMPAIGN_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        createCampaignData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'CREATE_CAMPAIGN_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        createCampaignData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'CREATE_CAMPAIGN_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        createCampaignData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Поиск стран
     */
    case 'SEARCH_COUNTRIES_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        searchCountriesData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'SEARCH_COUNTRIES_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        searchCountriesData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'SEARCH_COUNTRIES_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        searchCountriesData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Получение офферов
     */
    case 'GET_OFFERS_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        getOffersData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'GET_OFFERS_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        getOffersData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'GET_OFFERS_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        getOffersData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Создание оффера
     */
    case 'CREATE_OFFER_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        createOfferData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'CREATE_OFFER_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        createOfferData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'CREATE_OFFER_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        createOfferData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Загрузка иконки оффера
     */
    case 'UPLOAD_OFFER_ICON_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        uploadOfferIconData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'UPLOAD_OFFER_ICON_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        uploadOfferIconData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'UPLOAD_OFFER_ICON_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        uploadOfferIconData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Загрузка изображения оффера
     */
    case 'UPLOAD_OFFER_IMAGE_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        uploadOfferImageData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'UPLOAD_OFFER_IMAGE_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        uploadOfferImageData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'UPLOAD_OFFER_IMAGE_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        uploadOfferImageData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Удаление кампании
     */
    case 'DELETE_CAMPAIGN_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        deleteCampaignData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'DELETE_CAMPAIGN_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        deleteCampaignData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'DELETE_CAMPAIGN_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        deleteCampaignData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Получение кампании
     */
    case 'GET_CAMPAIGN_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        getCampaignData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'GET_CAMPAIGN_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        getCampaignData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'GET_CAMPAIGN_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        getCampaignData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Изменение оффера
     */
    case 'UPDATE_OFFER_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        updateOfferData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'UPDATE_OFFER_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        updateOfferData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'UPDATE_OFFER_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        updateOfferData: {
          type: action.type,
          data: action,
        },
      });
    /**
     * Изменение кампании
     */
    case 'UPDATE_CAMPAIGN_REQUESTED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        updateCampaignData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'UPDATE_CAMPAIGN_SUCCEEDED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action.data;
      return Object.assign(copyState, {
        updateCampaignData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'UPDATE_CAMPAIGN_FAILED':
      copyState = Object.assign(copyState, state);
      copyState.type = action.type;
      copyState.data = action;
      return Object.assign(copyState, {
        updateCampaignData: {
          type: action.type,
          data: action,
        },
      });
    default:
      return state;
  }
}
