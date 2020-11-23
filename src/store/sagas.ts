/**
 * Файл с сагами, здесь объявляется функция задачи например для запроса на сервер и наполнения хранилища,
 * в зависимости от результата запроса.
 * И экспортируется прослушиватель для store/index.ts
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import Api from '../api/index';
import * as Types from '../react-app-env';

const errorData: Types.ServerResponse = {
  result: 'error',
  message: 'No internet',
  body: {},
};

// Задачи

/**
 * Запрос данных пользователя
 * @param action
 */
function* fetchUser(action: any) {
  try {
    const data = yield call(Api.fetchUser, action);
    yield put({ type: 'USER_FETCH_SUCCEEDED', data });
  } catch (e) {
    yield put({ type: 'USER_FETCH_FAILED', errorData });
  }
}

// Прослушиватели задач

/**
 * Прослушиватель задачи данных пользователя
 */
export function* userSaga() {
  yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}
