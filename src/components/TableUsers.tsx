import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import { useHistory } from 'react-router-dom';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import dayjs from 'dayjs';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';
import { store } from '../store';

const useStyles = makeStyles({
  root: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  tableCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  self: {
    background: '#fff',
  },
});

export default function TableUsers(props: Types.TableUsersProps) {
  const history = useHistory();
  const { rows } = props;
  const classes = useStyles();
  const [userId, setUserId] = useState<number>(-1);
  const [width, setWidth] = useState<string>('');

  const changeWidth = () => {
    setWidth(`${document.body.clientWidth - 48}px`);
  };

  useEffect(() => {
    window.addEventListener('resize', changeWidth);
    const state = store.getState();
    const { userData } = state;
    if (userData) {
      const { data }: any = userData;
      if (userData.type === 'USER_FETCH_SUCCEEDED') {
        setUserId(data.body.user.id);
      }
    }
    return () => {
      window.removeEventListener('resize', changeWidth);
    };
  }, [width]);

  return (
    <Auth roles={['admin']} redirect={true}>
      <div className={classes.root} style={{ width }}>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="left">ID</TableCell>
                <TableCell align="right">First name</TableCell>
                <TableCell align="left">Last name</TableCell>
                <TableCell align="right">Admin</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="right">Confirm</TableCell>
                <TableCell align="right">Email</TableCell>
                <TableCell align="right">Company</TableCell>
                <TableCell align="right">Skype</TableCell>
                <TableCell align="right">Created</TableCell>
                <TableCell align="right">Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow className={row.id === userId ? classes.self : 'default'} key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell align="right">{row.first_name}</TableCell>
                  <TableCell align="right"> {row.last_name}</TableCell>
                  <TableCell align="right">{row.admin}</TableCell>
                  <TableCell align="right">{row.balance || 0}</TableCell>
                  <TableCell align="right">{row.confirm}</TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.company}</TableCell>
                  <TableCell align="right">{row.skype}</TableCell>
                  <TableCell align="right">{dayjs(row.created).format('DD-MM-YYYY')}</TableCell>
                  <TableCell align="right">{dayjs(row.updated).format('DD-MM-YYYY')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Auth>
  );
}
