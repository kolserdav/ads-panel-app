import React, { useState, useEffect } from 'react';
import { Typography, FormLabel, FormGroup, TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import BlockProgress from '../components/BlockProgress';
import AlertMessage from '../components/AlertMessage';
import { loadStore, store, action } from '../store';
import * as Types from '../react-app-env';

let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};

export default function ChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [load, setLoad] = useState(false);
  const parsedQuery = queryString.parse(history.location.search);
  const _alert: Types.AlertProps = {
    message: 'Alert closed',
    status: 'info',
    open: false,
  };
  const [alert, setAlert] = useState(_alert);

  useEffect(() => {
    _loadStoreSubs = loadStore.subscribe(() => {
      setLoad(loadStore.getState().value);
    });
    _storeSubs = store.subscribe(() => {
      const state = store.getState();
      if (state.passData) {
        if (state.type === 'CHANGE_PASS_FAILED') {
          const { message }: any = state.passData?.data?.errorData;
          enqueueSnackbar(`Change password: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'CHANGE_PASS_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data } = state.passData;
          const newAlert: any = {
            open: true,
            message: data?.message,
            status: data?.result,
          };
          setAlert(newAlert);
          if (data?.result === 'success') {
            setTimeout(() => {
              history.push('/');
            }, 1500);
          }
        }
      }
    });
    return () => {
      _storeSubs();
      _loadStoreSubs();
    };
  }, []);

  const token: any = parsedQuery.k;
  const email: any = parsedQuery.e;
  return (
    <div className={clsx('login-wrapper', 'col-center')}>
      <div className="header">
        <Typography variant="h4">Change password form</Typography>
      </div>
      <div className="form-item">
        <Typography>Please fill in all fields</Typography>
      </div>
      <FormGroup>
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
        <FormLabel>Password repeat</FormLabel>
        <div className={clsx('form-item', 'col-center')}>
          <TextField
            defaultValue={passwordRepeat}
            onChange={(e: any) => {
              setPasswordRepeat(e.target.value);
            }}
            type="password"
            variant="outlined"
            placeholder="password repeat"
          />
        </div>
      </FormGroup>
      <div className="form-item">
        {load ? (
          <BlockProgress />
        ) : (
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            // eslint-disable-next-line no-unused-vars
            onClick={(e: any) => {
              loadStore.dispatch({ type: 'SET_LOAD', value: true });
              action({
                type: 'CHANGE_PASS_REQUESTED',
                args: { token, body: { password, password_repeat: passwordRepeat, email } },
              });
              setAlert(_alert);
            }}>
            Send
          </Button>
        )}
      </div>
      <div className="form-item">
        {alert.open ? <AlertMessage message={alert.message} status={alert.status} /> : ''}
      </div>
      <div className="form-item">
        <Link to="/forgot">Send new email</Link>
      </div>
    </div>
  );
}