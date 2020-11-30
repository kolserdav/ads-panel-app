import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  FormLabel,
  FormGroup,
  Checkbox,
  CircularProgress,
} from '@material-ui/core';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import AlertMessage from '../components/AlertMessage';
import { action, loadStore, store } from '../store';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';

// Ограничители подписок, чтобы по нескольку раз не подписывалось на одно и тоже хранилище
let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};

let userId = -1;

interface RegistrationInterface {
  update: boolean;
}

export default function Registration(props: RegistrationInterface) {
  const { update } = props;
  const history = useHistory();
  if (update) {
    const { pathname } = history.location;
    const newUserId = pathname.match(/\d+$/);
    if (newUserId) {
      userId = parseInt(newUserId[0], 10);
    }
  }
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonDisable, setButtonDisable] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [skype, setSkype] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [load, setLoad] = useState(false);
  const [user, setUser] = useState<Types.User>();
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
    // Обработчик запроса на сервер
    _storeSubs = store.subscribe(() => {
      const state: Types.Reducer = store.getState();
      if (update) {
        const { userData } = state;
        if (userData) {
          // Когда нужно последнее событи конкретного объекта хранилища
          if (userData.type === 'USER_FETCH_SUCCEEDED') {
            const { data }: any = userData;
            const { body } = data;
            if (userId !== body.user.id && body.user.admin !== 1) {
              history.push('/');
            } else {
              setUser(body.user);
            }
          }
        }
      }
      if (state.registerData) {
        // Когда нужно самое последнее событие хранилища
        if (state.type === 'REGISTRATION_FAILED') {
          const { message }: any = state.registerData.data?.errorData;
          enqueueSnackbar(`Registration: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'REGISTRATION_SUCCEEDED') {
          const { data } = state.registerData;
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
            }, 2000);
          }
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
    <Auth redirect={true} roles={['guest']}>
      <div className={clsx('login-wrapper', 'col-center')}>
        <div className="header">
          <Typography variant="h4">Registration form</Typography>
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
          <FormLabel>First name</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              defaultValue={firstName}
              onChange={(e: any) => {
                setFirstName(e.target.value);
              }}
              type="name"
              variant="outlined"
              placeholder="last name"
            />
          </div>
          <FormLabel>Last name</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              defaultValue={lastName}
              onChange={(e: any) => {
                setLastName(e.target.value);
              }}
              type="name"
              variant="outlined"
              placeholder="last name"
            />
          </div>
          <FormLabel>Company</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              defaultValue={company}
              onChange={(e: any) => {
                setCompany(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="company"
            />
          </div>
          <FormLabel>Skype</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              defaultValue={skype}
              onChange={(e: any) => {
                setSkype(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="skype"
            />
          </div>
          <div className={clsx('row-center', 'form-item')}>
            <Checkbox
              onChange={(e) => {
                setButtonDisable(!e.target.checked);
              }}
            />
            <Typography>Accept Terms of use</Typography>
          </div>
        </FormGroup>
        <div className="form-item">
          {load ? (
            <CircularProgress />
          ) : (
            <Button
              disabled={buttonDisable}
              variant="contained"
              color="secondary"
              type="submit"
              // eslint-disable-next-line no-unused-vars
              onClick={(e: any) => {
                setAlert(_alert);
                loadStore.dispatch({ type: 'SET_LOAD', value: true });
                action({
                  type: 'REGISTRATION_REQUESTED',
                  args: {
                    body: {
                      email,
                      password,
                      password_repeat: passwordRepeat,
                      first_name: firstName,
                      last_name: lastName,
                      company,
                      skype,
                    },
                  },
                });
              }}>
              Send
            </Button>
          )}
        </div>
        <div className="form-item">
          {alert.open ? <AlertMessage message={alert.message} status={alert.status} /> : ''}
        </div>
      </div>
    </Auth>
  );
}