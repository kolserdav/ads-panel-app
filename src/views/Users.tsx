import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import * as Types from '../react-app-env';
import TableUsers from '../components/TableUsers';
import Auth from '../components/Auth';
import { store, action, loadStore } from '../store';
import Pagination from '../components/Pagination';

let _storeSubs: any = () => {};

export default function Users() {
  const [rows, setRows] = useState<Types.User[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [count, setCount] = useState<number>(0);

  const { enqueueSnackbar } = useSnackbar();

  const getUsers = (limit: number, current: number) => {
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'USERS_FETCH_ADMIN_REQUESTED',
      args: {
        params: {
          limit,
          current: current + 1,
        },
      },
    });
  };

  useEffect(() => {
    getUsers(rowsPerPage, page);
    _storeSubs = store.subscribe(() => {
      const state = store.getState();
      const { usersFetchAdminData } = state;
      if (usersFetchAdminData) {
        if (state.type === 'USERS_FETCH_ADMIN_FAILED') {
          const { message }: any = usersFetchAdminData.data?.errorData;
          enqueueSnackbar(`Get users: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'USERS_FETCH_ADMIN_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = usersFetchAdminData;
          const { body }: any = data;
          if (data.result !== 'success') {
            enqueueSnackbar(data.message);
            return 1;
          }
          const { users }: any = body;
          setRows(users);
          setCount(body.count);
        }
      }
      return 0;
    });
    return () => {
      _storeSubs();
    };
  }, []);

  return (
    <Auth redirect={true} roles={['admin']}>
      <div className="header">
        <Typography variant="h5">User list</Typography>
      </div>
      <TableUsers rows={rows} />
      <Pagination
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, newPage) => {
          setPage(newPage);
          getUsers(rowsPerPage, newPage);
        }}
        handleChangeRowsPerPage={(event) => {
          const { value }: any = event.target;
          setRowsPerPage(value);
          setPage(0);
          getUsers(value, 0);
        }}
      />
    </Auth>
  );
}
