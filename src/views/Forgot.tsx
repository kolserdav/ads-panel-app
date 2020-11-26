import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Typography,
  TextField,
  Button,
  FormGroup,
  FormLabel,
  CircularProgress,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import AlertMessage from '../components/AlertMessage';
import { action, store, loadStore } from '../store';
import * as Types from '../react-app-env';

let _storeSubs = false;
let _loadStoreSubs = false;

export default function Confirm() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [load, setLoad] = useState(false);
  const [email, setEmail] = useState('');
  const _alert: Types.AlertProps = {
    open: false,
    message: 'Alert closed',
    status: 'info',
  };
  const [alert, setAlert] = useState(_alert);
  useEffect(() => {
    if (!_loadStoreSubs) {
      _loadStoreSubs = true;
      loadStore.subscribe(() => {
        setLoad(loadStore.getState().value);
      });
    }
    if (!_storeSubs) {
      _storeSubs = true;
      store.subscribe(() => {
        const state = store.getState();
        const { emailData } = state;
        if (emailData) {
          if (state.type === 'EMAIL_SUCCEEDED') {
            const { data }: any = emailData;
            setAlert({
              message: data.message,
              status: data.result,
              open: true,
            });
            loadStore.dispatch({ type: 'SET_LOAD', value: false });
          } else if (state.type === 'EMAIL_FAILED') {
            const { message }: any = emailData.data?.errorData;
            enqueueSnackbar(`Forgot password: ${message}`);
            loadStore.dispatch({ type: 'SET_LOAD', value: false });
          }
        }
      });
    }
  }, []);

  return (
    <div className={clsx('col-center')}>
      <div className="header">
        <Typography variant="h4">Request to change password</Typography>
      </div>
      <FormGroup>
        <FormLabel>Email</FormLabel>
        <div className="form-item">
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
      </FormGroup>
      <div className="form-item">
        {load ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            // eslint-disable-next-line no-unused-vars
            onClick={(e: any) => {
              setAlert(_alert);
              loadStore.dispatch({ type: 'SET_LOAD', value: true });
              action({ type: 'EMAIL_REQUESTED', args: { body: { email } } });
            }}>
            Send
          </Button>
        )}
      </div>
      <div className="form-item">
        {alert.open ? <AlertMessage status={alert.status} message={alert.message} /> : ''}
      </div>
    </div>
  );
}
