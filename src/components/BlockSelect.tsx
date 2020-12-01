import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import * as Types from '../react-app-env';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function SimpleSelect(props: Types.SelectProps) {
  const { children, handleChange, value, name, disabled } = props;
  const classes = useStyles();
  return (
    <div>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">{name}</InputLabel>
        <Select
          disabled={disabled}
          color="secondary"
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={value}
          onChange={handleChange}
          label={name}>
          {children}
        </Select>
      </FormControl>
    </div>
  );
}