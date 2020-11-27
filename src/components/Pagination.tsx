import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import * as Types from '../react-app-env';

export default function BlockTablePagination(props: Types.Pagination) {
  const { count, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = props;

  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      onChangePage={handleChangePage}
      rowsPerPage={rowsPerPage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
}
