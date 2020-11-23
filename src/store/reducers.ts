/**
 * Единый файл редьюсеров,
 * просто экспортирует набор типов обращений к хранилищу.
 */

import Types from '../react-app-env';

const initialData: Types.ServerResponse = {
  result: 'wait',
  message: 'no data',
  body: {},
};

const initialState: any = {
  type: 'INITIAL_TYPE',
  data: initialData,
};

export default function appReducer(state = initialState, action: Types.Action) {
  switch (action.type) {
    case 'USER_FETCH_REQUESTED':
      return {
        type: action.type,
        data: initialData,
      };
    case 'USER_FETCH_SUCCEEDED':
      return action;
    case 'USER_FETCH_FAILED':
      return action;
    default:
      return state;
  }
}
