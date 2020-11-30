import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import { Route, Switch, withRouter } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Cookies } from 'react-cookie';
import Panel from './components/Panel';
import Home from './views/Home';
import Login from './views/Login';
import Page404 from './views/Page404';
import Dashboard from './views/Dashboard';
import Registration from './views/Registration';
import Confirm from './views/Confirm';
import Forgot from './views/Forgot';
import Campaigns from './views/Campaigns';
import ChangePassword from './views/ChangePassword';
import CreateCampaign from './views/CreateCampaign';
import { action } from './store';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#172a3a',
    },
    secondary: {
      main: '#61dafb',
    },
    background: {
      paper: '#f6f7f9',
    },
  },
});

const cookies = new Cookies();

let oldToken = '';

function App(props: any) {
  const { history } = props;
  const { pathname } = history.location;
  const [title, setTitle]: any = useState('_qt');

  useEffect(() => {
    let mounted = true;
    let header: string = '';
    // Название страницы в зависимости от пути
    switch (pathname) {
      case '/':
        header = 'Home';
        break;
      case '/login':
        header = 'Login';
        break;
      case '/dashboard':
        header = 'Dashboard';
        break;
      case '/registration':
        header = 'Registration';
        break;
      case '/confirm':
        header = 'Confirm email';
        break;
      case '/forgot':
        header = 'Change password request';
        break;
      case '/change-user-pwd':
        header = 'Change password';
        break;
      case '/campaigns':
        header = 'Campaigns';
        break;
      case '/new-campaign':
        header = 'Create new campaign';
        break;
      default:
        break;
    }
    if (mounted) setTitle(header);
    const token = cookies.get('_qt');
    // Если токен не поменялся значит сессия та же и при переходах не запрашивает аутентификацию
    if (token !== oldToken) {
      // eslint-disable-next-line dot-notation
      action({ type: 'USER_FETCH_REQUESTED', args: { token } });
      oldToken = token;
    }
    return () => {
      mounted = false;
    };
  }, [history.location]);

  return (
    <ThemeProvider theme={theme}>
      <Panel namePage={title} window={() => window}>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/confirm">
            <Confirm />
          </Route>
          <Route path="/forgot">
            <Forgot />
          </Route>
          <Route path="/change-user-pwd">
            <ChangePassword />
          </Route>
          <Route path="/Campaigns">
            <Campaigns />
          </Route>
          <Route path="/new-campaign">
            <CreateCampaign />
          </Route>
          <Route path="/update-campaign/:id">
            <CreateCampaign update={true} />
          </Route>
          <Route path="/">{pathname === '/' ? <Home /> : <Page404 />}</Route>
        </Switch>
      </Panel>
    </ThemeProvider>
  );
}

export default withRouter(App);
