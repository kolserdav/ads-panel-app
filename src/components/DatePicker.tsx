import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Types from '../react-app-env';

export default function DatePickerElement(props: Types.DatePicker) {
  const { onChange, startDate } = props;
  return <DatePicker showTimeSelect selected={startDate} onChange={onChange} />;
}
