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
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import AlertMessage from '../components/AlertMessage';
import { action, store, loadStore } from '../store';
import * as Types from '../react-app-env';

const body: any = document.querySelector('body');
// Ширина контейнера формы
const minWidth = body.clientWidth > 500 ? 500 : 300;

const useStyles = makeStyles({
  root: {
    width: `${minWidth}px`,
  },
});

let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};

interface ForgotInterface {
  userEmail?: string;
  showAsAdmin?: boolean;
}

export default function Forgot(props: ForgotInterface) {
  const classes = useStyles();
  const { userEmail, showAsAdmin } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [load, setLoad] = useState(false);
  const [email, setEmail] = useState('');
  const _alert: Types.AlertProps = {
    open: false,
    message: 'Alert closed',
    status: 'info',
  };
  const [alert, setAlert] = useState(_alert);
  useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
    _loadStoreSubs = loadStore.subscribe(() => {
      setLoad(loadStore.getState().value);
    });
    _storeSubs = store.subscribe(() => {
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
    return () => {
      _storeSubs();
      _loadStoreSubs();
    };
  }, []);

  return (
    <div className={clsx('col-center')}>
      {userEmail ? (
        ''
      ) : (
        <FormGroup className={classes.root}>
          <div className="header">
            <Typography variant="h4">Request to change password</Typography>
          </div>
          <FormLabel>Email</FormLabel>
          <div className="form-item">
            <TextField
              fullWidth
              value={email}
              onChange={(e: any) => {
                setEmail(e.target.value);
              }}
              type="email"
              variant="outlined"
              placeholder="email"
            />
          </div>
        </FormGroup>
      )}
      <div className="form-item">
        {load ? (
          <CircularProgress />
        ) : (
          <Button
            disabled={showAsAdmin}
            className={classes.root}
            variant="contained"
            color="secondary"
            type="submit"
            // eslint-disable-next-line no-unused-vars
            onClick={(e: any) => {
              setAlert(_alert);
              loadStore.dispatch({ type: 'SET_LOAD', value: true });
              action({ type: 'EMAIL_REQUESTED', args: { body: { email } } });
            }}>
            {userEmail ? 'Change password' : 'Send'}
          </Button>
        )}
      </div>
      <div className="form-item">
        {alert.open ? <AlertMessage status={alert.status} message={alert.message} /> : ''}
      </div>
    </div>
  );
}
