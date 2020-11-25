import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, FormLabel, FormGroup } from '@material-ui/core';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import AlertMessage from '../components/AlertMessage';
import { action, loadStore, store } from '../store';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';

export default function Login() {
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const _alert: Types.AlertProps = {
    message: 'Alert closed',
    status: 'info',
    open: false,
  }
  const [alert, setAlert] = useState(_alert);

  useEffect(() => {
    // Обработчик запроса на сервер
    store.subscribe(() => {
      const state: Types.Reducer = store.getState();
      if (state.loginData) {
        if (state.loginData.type === 'LOGIN_SUCCEEDED') {
          const { data } = state.loginData;
          const newAlert: any = {
            open: true,
            message: data?.message,
            status: data?.result,
          };
          setAlert(newAlert);
          if (data?.result === 'success') {
            const { token } = data.body;
            // Устанавливате куки с токеном
            setCookie('_qt', token, {
              path: '/',
              sameSite: true,
              expires: new Date(Date.now() + 3600 * 24 * 1000 * 90),
            });
            setTimeout(() => {
              history.push('/dashboard', 'redirect');
            }, 1000);
          }
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        }
      }
    });
  }, []);

  return (
    <Auth redirect={true} roles={['guest']}>
      <div className={clsx('login-wrapper', 'col-center')}>
        <div className="header">
          <Typography variant="h4">Login form</Typography>
        </div>
        <div className="form-item">
          <Typography>Please fill in all fields</Typography>
        </div>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              defaultValue={email}
              onChange={(e: any) => {
                setEmail(e.target.value);
              }}
              type="email"
              variant="outlined"
              placeholder="email"
            />
          </div>
          <FormLabel>Password</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              defaultValue={password}
              onChange={(e: any) => {
                setPassword(e.target.value);
              }}
              type="password"
              variant="outlined"
              placeholder="password"
            />
          </div>
        </FormGroup>
        <div className="form-item">
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            // eslint-disable-next-line no-unused-vars
            onClick={(e: any) => {
              loadStore.dispatch({ type: 'SET_LOAD', value: true });
              action({ type: 'LOGIN_REQUESTED', args: { body: { email, password } } });
            }}>
            Send
          </Button>
        </div>
        <div className="form-item">
          {alert.open ? <AlertMessage message={alert.message} status={alert.status} /> : ''}
        </div>
      </div>
    </Auth>
  );
}