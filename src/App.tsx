import React, { useEffect } from 'react';
import './styles/App.scss';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import { action } from './store';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

function App() {
  useEffect(() => {
    action({ type: 'USER_FETCH_REQUESTED', args: { token: 'dasdas' } });
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Link to="/dashboard">
          <Typography color="primary">dasdas</Typography>
        </Link>
        <Switch>
          <Route path="/test">
            {() => {
              return <div>22222222</div>;
            }}
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
