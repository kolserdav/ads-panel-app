/**
 * Единый файл редьюсеров,
 * просто экспортирует набор типов обращений к хранилищу.
 */

import Types from '../react-app-env';

// Вид структуры данных, которые хрангят ответы от сервера
const initialData: Types.Reducer = {
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
  switch (action.type) {
    /**
     * Получение сессии
     */
    case 'USER_FETCH_REQUESTED':
      return Object.assign(state, {
        userData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'USER_FETCH_SUCCEEDED':
      return Object.assign(state, {
        userData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'USER_FETCH_FAILED':
      return Object.assign(state, {
        userData: {
          type: action.type,
          data: action.data,
        },
      });
    /**
     * Вход пользователя
     */
    case 'LOGIN_REQUESTED':
      return Object.assign(state, {
        loginData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'LOGIN_SUCCEEDED':
      return Object.assign(state, {
        loginData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'LOGIN_FAILED':
      return Object.assign(state, {
        loginData: {
          type: action.type,
          data: action.data,
        },
      });
    /**
     * Регистрация пользователя
     */
    case 'REGISTRATION_REQUESTED':
      return Object.assign(state, {
        registerData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'REGISTRATION_SUCCEEDED':
      return Object.assign(state, {
        registerData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'REGISTRATION_FAILED':
      return Object.assign(state, {
        registerData: {
          type: action.type,
          data: action.data,
        },
      });
    /**
     * Подтверждение почты
     */
    case 'CONFIRM_REQUESTED':
      return Object.assign(state, {
        confirmData: {
          type: action.type,
          data: initialData,
        },
      });
    case 'CONFIRM_SUCCEEDED':
      return Object.assign(state, {
        confirmData: {
          type: action.type,
          data: action.data,
        },
      });
    case 'CONFIRM_FAILED':
      return Object.assign(state, {
        confirmData: {
          type: action.type,
          data: action.data,
        },
      });
    default:
      return state;
  }
}
