import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';
import * as Types from '../react-app-env';
import { action, store } from '../store';

export default function Confirm() {
  const history = useHistory();
  const parsedQuery = queryString.parse(history.location.search);
  const { e, k } = parsedQuery;
  const _alert: Types.AlertProps = {
    message: 'Alert closed',
    status: 'info',
    open: false,
  };
  const [alert, setAlert] = useState(_alert);

  useEffect(() => {
    store.subscribe(() => {
      const state = store.getState();
      const { confirmData } = state;
      if (confirmData) {
        const { data }: any = confirmData;
        if (confirmData.type === 'CONFIRM_SUCCEEDED') {
          setAlert({
            open: true,
            status: data.result,
            message: data.message,
          });
        }
      }
    });
    action({
      type: 'CONFIRM_REQUESTED',
      args: {
        params: { e, k },
      },
    });
  }, []);

  return (
    <div className="col-center">
      <Typography variant="h4">{e}</Typography>
      <div className="form-item">
        {alert.open ? <AlertMessage message={alert.message} status={alert.status} /> : ''}
      </div>
    </div>
  );
}