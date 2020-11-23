import React, { useEffect } from 'react';
import * as Types from '../react-app-env';
import { store } from '../store';

export default function OrAdmin(props: Types.OrAdminProps) {
  const { role } = props;
  useEffect(() => {
    store.subscribe(() => {
      console.log(2, store.getState());
    });
  });

  return (
    <div>
      {role === 'admin' || role === 'user' ? <div role={role}>or admin</div> : <div>404</div>}
    </div>
  );
}
