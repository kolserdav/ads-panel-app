import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as Types from '../react-app-env';
import { store, loadStore } from '../store';

/**
 * проверка открыт ли объект, в зависимости от роли полученной с сервера,
 * и списка ролей указанных на данную страницу.
 * @param state - поьзователь из хранилища
 * @param roles - роли из пропсов
 */
const checkState = (state: Types.Reducer, roles: Types.Roles[]) => {
  let _open = false;
  if (state.userData) {
    if (state.userData.type === 'USER_FETCH_SUCCEEDED') {
      const { data } = state.userData;
      if (data?.result === 'success') {
        const { user }: any = data.body;
        const { admin } = user;
        if (admin === 0) {
          if (roles.indexOf('user') !== -1) {
            _open = true;
          }
        } else if (roles.indexOf('admin') !== -1) {
          _open = true;
        }
      } else if (roles.indexOf('guest') !== -1) {
        _open = true;
      }
    }
  }
  return _open;
};

let showMessage = false;

/**
 * Обертка для защиты страниц, в зависимости от roles, допускает или нет к указанному компоненту,
 * если нет, то вместо элемента просто пустое место
 * @param props {Types.AuthProps}
 */
export default function Auth(props: Types.AuthProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { roles, children, redirect } = props;
  const [open, setOpen] = useState(false);
  const [_redirect, _setRedirect] = useState(false);

  /**
   * Сверят передынный редирект и открыт ли ресурс для пустого элемента или страницы
   * @param mounted
   */
  const checkRoles = () => {
    const _open = checkState(store.getState(), roles);
    const state: Types.Reducer = store.getState();
    const { userData }: Types.Reducer = state;
    if (!userData) return;
    // Вывод ошибки соединения ограничен одним сообщением чтобы не спамить на каждый компонент по сообщению
    if (state.type === 'USER_FETCH_FAILED' && !showMessage) {
      showMessage = true;
      const { message }: any = userData.data?.errorData;
      enqueueSnackbar(`Auth: ${message}`);
      loadStore.dispatch({ type: 'SET_LOAD', value: false });
    } else if (
      redirect &&
      state.type === 'USER_FETCH_SUCCEEDED' &&
      userData.data?.result !== 'success' &&
      !_open
    ) {
      _setRedirect(true);
    }
    setOpen(_open);
    if (_open && state.type === 'USER_FETCH_SUCCEEDED') {
      loadStore.dispatch({ type: 'SET_LOAD', value: false });
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) checkRoles();
    // Здесь не ограничиваем одной подпиской, так как на каждое событие своя подписка
    store.subscribe(() => {
      if (mounted) checkRoles();
    });
    return () => {
      mounted = false;
    };
  }, [open]);
  const EmptyElem = () => <div>{_redirect ? <Redirect to="/" /> : ''}</div>;
  return <div>{open ? <div>{children}</div> : <EmptyElem />}</div>;
}
