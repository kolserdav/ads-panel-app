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

/**
 * Вход пользователя
 * @param action
 */
function* login(action: any) {
  try {
    const data = yield call(Api.login, action);
    yield put({ type: 'LOGIN_SUCCEEDED', data });
  } catch (e) {
    yield put({ type: 'LOGIN_FAILED', errorData });
  }
}

/**
 * Регистрация пользователя
 * @param action
 */
function* register(action: any) {
  try {
    const data = yield call(Api.register, action);
    yield put({ type: 'REGISTRATION_SUCCEEDED', data });
  } catch (e) {
    yield put({ type: 'REGISTRATION_FAILED', errorData });
  }
}

/**
 * Подтверждение почты
 * @param action
 */
function* confirm(action: any) {
  try {
    const data = yield call(Api.confirm, action);
    yield put({ type: 'CONFIRM_SUCCEEDED', data });
  } catch (e) {
    yield put({ type: 'CONFIRM_FAILED', errorData });
  }
}

// Прослушиватели задач

/**
 * Прослушиватель задачи данных пользователя
 */
export function* userSaga() {
  yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}

/**
 * Прослушиватель задачи входа пользователя
 */
export function* loginSaga() {
  yield takeLatest('LOGIN_REQUESTED', login);
}

/**
 * Прослушиватель задачи регистрации пользователя
 */
export function* registerSaga() {
  yield takeLatest('REGISTRATION_REQUESTED', register);
}

/**
 * Прослушиватель задачи подтверждения почты
 */
export function* confirmSaga() {
  yield takeLatest('CONFIRM_REQUESTED', confirm);
}
