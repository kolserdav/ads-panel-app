import React from 'react';
import Alert from '@material-ui/lab/Alert';
import * as Types from '../react-app-env';

export default function AllertMessage(props: Types.AlertProps) {
  const { message, status }: any = props;
  return (
    <Alert variant="outlined" severity={status}>
      {message}
    </Alert>
  );
}