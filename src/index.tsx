import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
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
