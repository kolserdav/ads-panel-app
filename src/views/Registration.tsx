/**
 * представление регистрации пользователя
 * также используется как форма изменения данных пользователя
 * и просмотра данных пользователя администратором
 */
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
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import AlertMessage from '../components/AlertMessage';
import { action, loadStore, store } from '../store';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';
import Forgot from './Forgot';

const body: any = document.querySelector('body');
// Ширина контейнера формы
const minWidth = body.clientWidth > 500 ? 500 : 300;

const useStyles = makeStyles({
  root: {
    width: `${minWidth}px`,
  },
});

// Ограничители подписок, чтобы по нескольку раз не подписывалось на одно и тоже хранилище
let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};

// ИД пользователя полученно из URL страницы
let userId = -1;

interface RegistrationInterface {
  update: boolean;
}

// Когда данные обновлены, ограничитель лишнего рендеринга
let _updated = false;
// Когда смотрит как админ
let _showAsAdmin = false;
// Исключает лишние запросы админа к данным пользователя
let _userReceived = false;

export default function Registration(props: RegistrationInterface) {
  const { update } = props;
  const roles: Types.Roles[] = update ? ['admin', 'user'] : ['guest'];
  const history = useHistory();
  const classes = useStyles();
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
  const [showAsAdmin, setShowAsAdmin] = useState<boolean>(_showAsAdmin);
  const [confirm, setConfirm] = useState<1 | 0>(0);
  const _alert: Types.AlertProps = {
    message: 'Alert closed',
    status: 'info',
    open: false,
  };
  const [alert, setAlert] = useState(_alert);

  /**
   * Обновляет значения полей в зависимости от контекста, админ смотрит чужие, или кто-то смотрит свои
   * @param userData {Types.Action}
   */
  const updateFields = (userData: Types.Action) => {
    const { data }: any = userData;
    // eslint-disable-next-line prefer-destructuring
    const user: Types.User = data.body.user;
    setConfirm(user.confirm);
    _showAsAdmin = userId !== user.id && user.admin === 1;
    // Когда не админ пытается получить доступ к данным другого пользователя
    if (userId !== user.id && user.admin !== 1) {
      history.push('/');
    } else if (!_showAsAdmin) {
      // Когда смотрит свои данные
      setEmail(user.email);
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setCompany(user.company);
      setSkype(user.skype);
    } else if (!_userReceived) {
      // Когда админ смотрит другого пользователя
      _userReceived = true;
      setShowAsAdmin(true);
      action({
        type: 'USER_FETCH_ADMIN_REQUESTED',
        args: {
          id: userId,
        },
      });
    }
    _updated = true;
  };

  // Когда смотрит свои данные
  const fillInputs = () => {
    if (update) {
      const state: Types.Reducer = store.getState();
      setButtonDisable(false);
      const { userData } = state;
      if (userData) {
        // Когда нужно последнее событи конкретного объекта хранилища
        if (userData.type === 'USER_FETCH_SUCCEEDED' && !_updated) {
          updateFields(userData);
        } else if (state.type === 'USER_FETCH_SUCCEEDED' && _updated) {
          updateFields(userData);
        }
      }
    }
  };

  const registerRequest = () => {
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
  };

  const updateUserRequest = () => {
    setAlert(_alert);
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'USER_UPDATE_REQUESTED',
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
  };

  const sendConfirmEmail = () => {
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'USER_UPDATE_REQUESTED',
      args: {
        body: {
          sendConfirm: 1,
        },
      },
    });
  };

  useEffect(() => {
    // Отслеживание URL чтобы обновить данные при переходе от другого пользователя админом к своему профилю
    const _h = history.listen(() => {
      _userReceived = false;
      _updated = false;
      setShowAsAdmin(false);
    });
    _loadStoreSubs = loadStore.subscribe(() => {
      setLoad(loadStore.getState().value);
    });
    fillInputs();
    // Обработчик запроса на сервер
    _storeSubs = store.subscribe(() => {
      const state: Types.Reducer = store.getState();
      fillInputs();
      const { registerData, userUpdateData, userFetchAdminData } = state;
      if (userFetchAdminData) {
        if (state.type === 'USER_FETCH_ADMIN_FAILED') {
          const { message }: any = userFetchAdminData.data?.errorData;
          enqueueSnackbar(`Get user: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'USER_FETCH_ADMIN_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = userFetchAdminData;
          if (data.result !== 'success') {
            enqueueSnackbar(data.message);
            return 1;
          }
          updateFields(userFetchAdminData);
        }
      }
      if (userUpdateData) {
        if (state.type === 'USER_UPDATE_FAILED') {
          const { message }: any = userUpdateData.data?.errorData;
          enqueueSnackbar(`Update user data: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'USER_UPDATE_SUCCEEDED') {
          _updated = true;
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = userUpdateData;
          setAlert({
            status: data.result,
            message: data.message,
            open: true,
          });
          action({ type: 'USER_FETCH_REQUESTED', args: {} });
          if (data.result !== 'success') {
            return 1;
          }
        }
      }
      if (registerData) {
        // Когда нужно самое последнее событие хранилища
        if (state.type === 'REGISTRATION_FAILED') {
          const { message }: any = registerData.data?.errorData;
          enqueueSnackbar(`Registration: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'REGISTRATION_SUCCEEDED') {
          const { data } = registerData;
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
      return 0;
    });
    return () => {
      _h();
      _storeSubs();
      _loadStoreSubs();
    };
  }, [history.location.pathname]);

  const personalData = showAsAdmin ? 'Data of user' : 'My personal data';

  return (
    <Auth redirect={true} roles={roles}>
      <div className={clsx('login-wrapper', 'col-center')}>
        <div className="header">
          <Typography variant="h4">{update ? personalData : 'Registration form'}</Typography>
        </div>
        <div className="form-item">
          <Typography>
            {update ? 'Some fields you can`t change' : 'Please fill in all fields'}
          </Typography>
        </div>
        <FormGroup className={classes.root}>
          <FormLabel>First name</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              disabled={showAsAdmin}
              fullWidth
              value={firstName}
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
              disabled={showAsAdmin}
              fullWidth
              value={lastName}
              onChange={(e: any) => {
                setLastName(e.target.value);
              }}
              type="name"
              variant="outlined"
              placeholder="last name"
            />
          </div>
          <FormLabel>Email</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              disabled={update}
              value={email}
              onChange={(e: any) => {
                setEmail(e.target.value);
              }}
              type="email"
              variant="outlined"
              placeholder="email"
            />
          </div>
          {update ? (
            <div className="col-center">
              <Forgot userEmail={email} showAsAdmin={showAsAdmin} />
            </div>
          ) : (
            <div>
              <FormLabel>Password</FormLabel>
              <div className={clsx('form-item', 'col-center')}>
                <TextField
                  fullWidth
                  value={password}
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
                  fullWidth
                  value={passwordRepeat}
                  onChange={(e: any) => {
                    setPasswordRepeat(e.target.value);
                  }}
                  type="password"
                  variant="outlined"
                  placeholder="password repeat"
                />
              </div>
            </div>
          )}
          <FormLabel>Company</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              disabled={showAsAdmin}
              fullWidth
              value={company}
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
              disabled={showAsAdmin}
              fullWidth
              value={skype}
              onChange={(e: any) => {
                setSkype(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="skype"
            />
          </div>
          {update ? (
            <div>
              {confirm === 0 ? (
                <Button
                  disabled={showAsAdmin}
                  className={classes.root}
                  onClick={() => {
                    sendConfirmEmail();
                  }}
                  color="secondary">
                  Send confirm email message
                </Button>
              ) : (
                ''
              )}
            </div>
          ) : (
            <div className={clsx('row-center', 'form-item')}>
              <Checkbox
                onChange={(e) => {
                  setButtonDisable(!e.target.checked);
                }}
              />
              <Typography>Accept Terms of use</Typography>
            </div>
          )}
        </FormGroup>
        <div className="form-item">
          {load ? (
            <CircularProgress />
          ) : (
            <Button
              className={classes.root}
              disabled={buttonDisable || showAsAdmin}
              variant="contained"
              color="secondary"
              type="submit"
              // eslint-disable-next-line no-unused-vars
              onClick={(e: any) => {
                if (update) {
                  updateUserRequest();
                } else {
                  registerRequest();
                }
              }}>
              {update ? 'Save' : 'Send'}
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