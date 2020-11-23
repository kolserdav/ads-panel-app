/**
 * Создется единое хранилище для всего приложения,
 * на него навешиваются разные посредники из ./sagas.ts
 * переключение вызовов производится в ./reducers.ts
 */

import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Types from '../react-app-env';
import appReducer from './reducers';
import { userSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(appReducer, applyMiddleware(sagaMiddleware));
// Навешивает посредников
sagaMiddleware.run(userSaga);

// Задает и экспортирует метод вызова саги
const action = (actionParams: Types.Action) => store.dispatch(actionParams);
export { store, action };
