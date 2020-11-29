import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import StatusIcon from '@material-ui/icons/VerifiedUser';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';
import { store } from '../store';

const useStyles = makeStyles({
  root: {
    width: `${document.body.clientWidth - 48}px`,
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
});

export default function TableCampaigns(props: Types.TableCampaignsProps) {
  const { rows, handleChangeStatus, handleDelete } = props;
  const classes = useStyles();
  const [userId, setUserId] = useState<number>(-1);

  useEffect(() => {
    const state = store.getState();
    const { userData } = state;
    if (userData) {
      const { data }: any = userData;
      if (userData.type === 'USER_FETCH_SUCCEEDED') {
        setUserId(data.body.user.id);
      }
    }
  }, []);

  return (
    <div className={classes.root}>
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left">ID</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Day budget</TableCell>
            <TableCell align="right">Countries</TableCell>
            <TableCell align="right">Offer</TableCell>
            <TableCell align="right">IP pattern</TableCell>
            <TableCell align="right">White list</TableCell>
            <TableCell align="right">Black list</TableCell>
            <TableCell align="right">Created</TableCell>
            <TableCell align="right">Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell align="right"> {row.status}</TableCell>
              <TableCell align="right">{row.owner}</TableCell>
              <TableCell align="right">{row.price}</TableCell>
              <TableCell align="right">{row.budget}</TableCell>
              <TableCell align="right">{row.countries.map((i) => `${i}, `)}</TableCell>
              <TableCell align="right">{row.offer}</TableCell>
              <TableCell align="right">{row.ipPattern.map((i) => `${i}, `)}</TableCell>
              <TableCell align="right">{row.whiteList.map((i) => `${i}, `)}</TableCell>
              <TableCell align="right">{row.blackList.map((i) => `${i}, `)}</TableCell>
              <TableCell align="right">{row.created}</TableCell>
              <TableCell align="right">{row.updated}</TableCell>
              <TableCell align="right">
                <div className="row-center">
                  <Auth roles={['admin']} redirect={false}>
                    <IconButton
                      title="Change campaign status"
                      onClick={handleChangeStatus(row.status, row.title, row.id)}>
                      <StatusIcon color="secondary" />
                    </IconButton>
                  </Auth>
                  {userId === row.userId ? (
                    <IconButton
                      title="Edit campaign"
                      onClick={handleChangeStatus(row.status, row.title, row.id)}>
                      <EditIcon color="secondary" />
                    </IconButton>
                  ) : (
                    ''
                  )}
                  {userId === row.userId ? (
                    <IconButton
                      title="Delete campaign"
                      onClick={handleDelete(row.title, row.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  ) : (
                    ''
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}