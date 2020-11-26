import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { MenuItem } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import CostIcon from '@material-ui/icons/AttachMoney';
import ImpressionsIcon from '@material-ui/icons/Visibility';
import ClicksIcon from '@material-ui/icons/TouchApp';
import RequestsIcon from '@material-ui/icons/CallMade';
// @ts-ignore
import Worker from 'comlink-loader!../worker/index';
import Auth from '../components/Auth';
import * as lib from '../lib';
import * as Types from '../react-app-env';
import Graph from '../components/Graph';
import BlockSelect from '../components/BlockSelect';
import { action, store, loadStore } from '../store';
import ListElement from '../components/ListElement';

const worker = new Worker();

const _data = [
  { date: new Date('2020-11-14T12:56:37.000Z').toString().replace(/\(.*\)/, ''), clicks: 10, costs: 12 },
  { date: new Date('2020-11-14T13:56:37.000Z').toString(), clicks: 20, costs: 43 },
  { date: new Date('2020-11-14T14:56:37.000Z').toString(), clicks: 100, costs: 23 },
];

const timeValues: Types.TimeValues[] = [
  'today',
  'yesterday',
  'last-3-days',
  'last-7-days',
  'this-month',
  'last-30-days',
  'last-month',
  'this-quarter',
  'this-year',
  'last-year',
  'custom',
];

const times: React.ReactElement[] = timeValues.map((item) => {
  let name = item.replace(/-/g, ` `);
  const selected = name === 'last-month';
  name = lib.capitalizeFirstLetter(name);
  return (
    <MenuItem key={item} value={item} selected={selected}>
      {name}
    </MenuItem>
  );
});

let _storeSubs = false;

const DashboardElement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectValue, setSelectValue] = useState('last-month');
  const [graphDataArr, setGraphDataArr] = useState([]);
  const _allStat: Types.AllStat = {
    cost: 0,
    impress: 0,
    requests: 0,
    clicks: 0,
  };
  const [allStat, setAllStat] = useState(_allStat);

  const graphRequest = (value: Types.TimeValues) => {
    if (value !== 'custom') {
      action({ type: 'GRAPH_REQUESTED', args: { body: { time: value } } });
    } else {
      enqueueSnackbar('Custom parameter not working now...');
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: any }>) => {
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    const { value } = event.target;
    graphRequest(value);
    setSelectValue(value);
  };

  useEffect(() => {
    graphRequest('last-month');
    if (!_storeSubs) {
      _storeSubs = true;
      store.subscribe(() => {
        const state = store.getState();
        const { graphData } = state;
        if (graphData) {
          if (state.type === 'GRAPH_FAILED') {
            const { message }: any = graphData.data?.errorData;
            enqueueSnackbar(`Graph statistic: ${message}`);
            loadStore.dispatch({ type: 'SET_LOAD', value: false });
          } else if (state.type === 'GRAPH_SUCCEEDED') {
            loadStore.dispatch({ type: 'SET_LOAD', value: false });
            const { data }: any = graphData;
            const { all }: any = data.body;
            setAllStat({
              cost: all.cost,
              impress: all.impressions,
              clicks: all.clicks,
              requests: all.requests,
            });
            enqueueSnackbar(data?.message);
            const { graph } = data.body;
            const pr = worker.computeGraphData(graph);
            pr.then((d: any) => {
              setGraphDataArr(d);
            });
          }
        }
      });
    }
  }, []);

  return (
    <div className={clsx('full-width')}>
      <div className={clsx('dashboard-header', 'row-center')}>
        <ListElement title="Cost" value={allStat.cost}>
          <CostIcon />
        </ListElement>
        <ListElement title="Impressions" value={allStat.impress}>
          <ImpressionsIcon />
        </ListElement>
        <ListElement title="Requests" value={allStat.requests}>
          <RequestsIcon />
        </ListElement>
        <ListElement title="Clicks" value={allStat.clicks}>
          <ClicksIcon />
        </ListElement>
        <BlockSelect name="Time" value={selectValue} handleChange={handleSelectChange}>
          {times}
        </BlockSelect>
      </div>
      <Graph data={graphDataArr} />
    </div>
  );
};

export default function Dashboard() {
  return (
    <Auth redirect={true} roles={['admin', 'user']}>
      <DashboardElement />
    </Auth>
  );
}
