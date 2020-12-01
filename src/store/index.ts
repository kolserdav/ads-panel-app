/**
 * Создется единое хранилище для всего приложения,
 * на него навешиваются разные посредники из ./sagas.ts
 * переключение вызовов производится в ./reducers.ts
 */

// Ассинхронные вещи делаются через redux-saga

import { createStore, Store, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Types from '../react-app-env';
import appReducer from './reducers';
import {
  userSaga,
  userUpdateSaga,
  getUserForAdminSaga,
  getUsersForAdminSaga,
  loginSaga,
  registerSaga,
  confirmSaga,
  emailSaga,
  passSaga,
  graphSaga,
  tableSaga,
  getCampaignsSaga,
  changeCampaignStatusSaga,
  createCampaignSaga,
  searchCountriesSaga,
  getOffersSaga,
  createOfferSaga,
  uploadOfferIconSaga,
  uploadOfferImageSaga,
  deleteCampaignSaga,
  getCampaignSaga,
  updateOfferSaga,
  updateCampaignSaga,
} from './sagas';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(appReducer, applyMiddleware(sagaMiddleware));
// Навешивает посредников
sagaMiddleware.run(userSaga);
sagaMiddleware.run(userUpdateSaga);
sagaMiddleware.run(getUserForAdminSaga);
sagaMiddleware.run(getUsersForAdminSaga);
sagaMiddleware.run(loginSaga);
sagaMiddleware.run(registerSaga);
sagaMiddleware.run(confirmSaga);
sagaMiddleware.run(emailSaga);
sagaMiddleware.run(passSaga);
sagaMiddleware.run(graphSaga);
sagaMiddleware.run(tableSaga);
sagaMiddleware.run(getCampaignsSaga);
sagaMiddleware.run(changeCampaignStatusSaga);
sagaMiddleware.run(createCampaignSaga);
sagaMiddleware.run(searchCountriesSaga);
sagaMiddleware.run(getOffersSaga);
sagaMiddleware.run(createOfferSaga);
sagaMiddleware.run(uploadOfferIconSaga);
sagaMiddleware.run(uploadOfferImageSaga);
sagaMiddleware.run(deleteCampaignSaga);
sagaMiddleware.run(getCampaignSaga);
sagaMiddleware.run(updateOfferSaga);
sagaMiddleware.run(updateCampaignSaga);

/**
 * Задает и экспортирует метод вызова саги
 * @param actionParams - параметры
 */
const action = (actionParams: Types.Action) => store.dispatch(actionParams);
export { store, action };

// Синхронные вещи делаются redux без посредников

const loadStore: Store = createStore((state = false, syncAction: any) => {
  switch (syncAction.type) {
    case 'SET_LOAD':
      return syncAction;
    default:
      return state;
  }
});

export { loadStore };
