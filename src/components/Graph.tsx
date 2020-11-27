import React, { useEffect } from 'react';
import { Paper } from '@material-ui/core';
import clsx from 'clsx';
import { ArgumentAxis, ValueAxis, Chart, LineSeries, Legend } from '@devexpress/dx-react-chart-material-ui';
import * as Types from '../react-app-env';

export default function Graph(props: Types.GraphProps) {
  const { data } = props;

  const selfData =
    data.length === 0
      ? [
          {
            date: 0,
            clicks: 0,
            cost: 0,
          },
        ]
      : data;

  useEffect(() => {
    // console.log(data)
  }, [data]);

  return (
    <Paper>
      <Chart data={selfData}>
        <ArgumentAxis tickSize={23} position="top" showGrid={false} />
        <ValueAxis showGrid={true} />
        <LineSeries name="Impressions" valueField="impressions" argumentField="date" />
        <LineSeries name="Requests" valueField="requests" argumentField="date" />
        <LineSeries name="Clicks" valueField="clicks" argumentField="date" />
        <Legend position="bottom" />
      </Chart>
    </Paper>
  );
};
