import React from 'react';
import ReactDOM from 'react-dom';
import '@babel/polyfill';
import './index.css';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Для отладки по параметрам экрана
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('resize', () => {
    const body = document.querySelector('body');
    // eslint-disable-next-line no-console
    console.info('height', body?.clientHeight);
    // eslint-disable-next-line no-console
    console.info('width', body?.clientWidth);
  });
}

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

/**
 * Отслеживание поведения пользователей, для ведения аналитики, можно подключить к Google Analytics
 * В данный момент статистику ведет, но не реализует её никак, надо ещё изучать что это:
 * https://www.npmjs.com/package/web-vitals
 */
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
