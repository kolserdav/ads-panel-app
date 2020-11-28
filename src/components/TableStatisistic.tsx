import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as Types from '../react-app-env';
import BlockSelect from '../components/BlockSelect';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function TableStatistic(props: Types.TableStatisticProps) {
  const { rows, firstColumn, icons } = props;
  const classes = useStyles();

  useEffect(() => {
    
  },[icons] );

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Group by</TableCell>
            <TableCell align="right">
              <span className="margin-3">{firstColumn}</span>
              {icons.value}
            </TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">
              <span className="margin-3">Impressions</span>
              {icons.impressions}
            </TableCell>
            <TableCell align="right">
              <span className="margin-3">Requests</span>
              {icons.requests}
            </TableCell>
            <TableCell align="right">
              <span className="margin-3">Clicks</span>
              {icons.clicks}
            </TableCell>
            <TableCell align="right">Ctr</TableCell>
            <TableCell align="right">Win ratio (%)</TableCell>
            <TableCell align="right">Count events</TableCell>
            <TableCell align="right">
              <span className="margin-3">Cost</span>
              {icons.cost}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={`${row.value}-${index}`}>
              <TableCell component="th" scope="row">
                {row.first}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">{row.second}</TableCell>
              <TableCell align="right">{row.impressions}</TableCell>
              <TableCell align="right">{row.requests}</TableCell>
              <TableCell align="right">{row.clicks}</TableCell>
              <TableCell align="right">{row.ctr}</TableCell>
              <TableCell align="right">{row.winRatio}</TableCell>
              <TableCell align="right">{row.countEvents}</TableCell>
              <TableCell align="right">{row.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}