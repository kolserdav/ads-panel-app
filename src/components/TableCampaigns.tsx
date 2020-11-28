import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import EditIcon from '@material-ui/icons/Edit';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IconButton } from '@material-ui/core';
import * as Types from '../react-app-env';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default function TableCampaigns(props: Types.TableCampaignsProps) {
  const { rows, handleChangeStatus } = props;
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
          <TableCell align="left">ID</TableCell>
            <TableCell align="right">Title</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="right">Owner</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.title}</TableCell>
              <TableCell className={classes.tableCell} align="right">
                {row.status}
                <IconButton
                  key={row.status}
                  onClick={handleChangeStatus(row.status, row.title, row.id)}>
                  <EditIcon color="secondary" />
                </IconButton>
              </TableCell>
              <TableCell align="right">{row.owner}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}