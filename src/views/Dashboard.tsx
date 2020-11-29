/**
 * Дашборд клиента и админа
 * выдаваемая информация определяется сервером по токену запроса, в зависимости от роли
 */
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { MenuItem, IconButton, Tooltip } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import CostIcon from '@material-ui/icons/AttachMoney';
import ImpressionsIcon from '@material-ui/icons/Visibility';
import ClicksIcon from '@material-ui/icons/TouchApp';
import RequestsIcon from '@material-ui/icons/CallMade';
import SendIcon from '@material-ui/icons/Send';
import SortIcon from '@material-ui/icons/Sort';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowsDownIcon from '@material-ui/icons/ArrowDownward';
import HelpIcon from '@material-ui/icons/Help';
// @ts-ignore
import Worker from 'comlink-loader!../worker/index'; // Так подключили вебворкер
import Auth from '../components/Auth';
import * as lib from '../lib';
import * as Types from '../react-app-env';
import Graph from '../components/Graph';
import BlockSelect from '../components/BlockSelect';
import { action, store, loadStore } from '../store';
import ListElement from '../components/ListElement';
import DatePickerElement from '../components/DatePicker';
import TableStatistic from '../components/TableStatisistic';
import BlockProgress from '../components/BlockProgress';
import BlockTablePagination from '../components/Pagination';

const worker = new Worker();

// Значения времени для селектора
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

// Получение options для селектора времени
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

// Значения селектора группировки
const groupByValues: Types.GroupBy[] = ['date', 'user', 'campaign', 'subid', 'country'];

// Options для селектора группировки
const groupByOptions: React.ReactElement[] = groupByValues.map((item: Types.GroupBy) => {
  const name = lib.capitalizeFirstLetter(item);
  const selected = item === 'campaign';
  return (
    <MenuItem key={item} value={item} selected={selected}>
      {name}
    </MenuItem>
  );
});

// Динамические значения колонки группировки таблицы статистики
const groupDynamic: any = ['date', 'campaign', 'subid', 'country'];

// Все возможные значения колонок таблицы сортировки
const sortIconsValues: Types.OrderByVariants[] = [
  'date',
  'campaign',
  'subid',
  'country',
  'requests',
  'impressions',
  'clicks',
  'cost',
];

// Глобальные переменные, значение которых нужны мгновенно и при их изменении не требуется рендеринг
let _desc = false;
let _time = 'last-month';
let _group: Types.OrderByVariants = 'campaign';
let _customTime: any = [];
let _sort = _group;
let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};

let _limit = 10;
let _current = 1;

const DashboardElement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectValue, setSelectValue]: any = useState(_time);
  const [graphDataArr, setGraphDataArr] = useState([]);
  const _allStat: Types.AllStat = {
    cost: 0,
    impressions: 0,
    requests: 0,
    clicks: 0,
  };
  const [allStat, setAllStat] = useState(_allStat);
  const [dateTo, setDateTo] = useState(new Date());
  const dateNow = new Date();
  dateNow.setDate(dateNow.getDate() - 2);
  const [dateFrom, setDateFrom] = useState(dateNow);
  const [showDP, setShowDP] = useState(false);
  const [load, setLoad] = useState(false);
  const [rows, setRows] = useState();
  const [groupBy, setGroupBy]: any = useState(_group);
  const [firstColumn, setFirstColumn] = useState('Campaign');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(11);
  const [tooltip, setTooltip] = useState(false);

  // Запрос данных таблицы с учетом сортировки
  const setSortAndDesc = (sortValue: Types.OrderByVariants, descValue: boolean) => {
    action({
      type: 'TABLE_REQUESTED',
      args: {
        body: {
          time: _time,
          group: _group,
          sort: sortValue,
          desc: descValue,
          limit: _limit,
          current: _current,
          customTime: _customTime,
        },
      },
    });
  };

  // TODO объединить в одну с setSortAndDesc и сделать обновление при запросе графика
  const tableRequest = (time: Types.TimeValues, group: Types.GroupBy) => {
    action({
      type: 'TABLE_REQUESTED',
      args: {
        body: { time, group, limit: _limit, current: _current, customTime: _customTime },
      },
    });
  };

  /**
   * Управляет иконками сортировки по колонкам таблицы
   * пришлось разбить на два блока if из-за динамичной колонки группировки
   * Работает на замыканиях глобальных переменных _sort и _desc
   */
  const getSortIcons = () => {
    const sortIcons: any = {};
    sortIconsValues.map((item: Types.OrderByVariants) => {
      // Если это динамичный параметр и сортировано по нему
      if (groupDynamic.indexOf(item) !== -1 && _sort === item) {
        if (!_desc) {
          sortIcons.value = (
            <ArrowsDownIcon
              onClick={() => {
                setSortAndDesc(item, !_desc);
              }}
              className="icon-button"
              color="secondary"
            />
          );
        } else {
          sortIcons.value = (
            <ArrowUpIcon
              onClick={() => {
                setSortAndDesc(item, !_desc);
              }}
              className="icon-button"
              color="secondary"
            />
          );
        }
        // Если динамичный и сортировано не по нему
      } else if (groupDynamic.indexOf(item) !== -1 && _sort !== item) {
        sortIcons.value = (
          <SortIcon
            onClick={() => {
              setSortAndDesc(item, !_desc);
            }}
            className="icon-button"
            color="secondary"
          />
        );
        // Если колонка со статичным значением
      } else {
        // eslint-disable-next-line no-lonely-if
        if (_sort !== item) {
          sortIcons[item] = (
            <SortIcon
              onClick={() => {
                setSortAndDesc(item, !_desc);
              }}
              className="icon-button"
              color="secondary"
            />
          );
        } else if (!_desc) {
          sortIcons[item] = (
            <ArrowsDownIcon
              onClick={() => {
                setSortAndDesc(item, !_desc);
              }}
              className="icon-button"
              color="secondary"
            />
          );
        } else {
          sortIcons[item] = (
            <ArrowUpIcon
              onClick={() => {
                setSortAndDesc(item, !_desc);
              }}
              className="icon-button"
              color="secondary"
            />
          );
        }
      }
      return 0;
    });
    return sortIcons;
  };

  const [icons, setIcons] = useState(getSortIcons());

  // Запрос данных графика
  const graphRequest = (value: Types.TimeValues) => {
    const _showDP = value === 'custom';
    if (!_showDP) {
      setShowDP(false);
      action({ type: 'GRAPH_REQUESTED', args: { body: { time: value } } });
    } else {
      setShowDP(true);
      enqueueSnackbar('Please select any times and press send');
      loadStore.dispatch({ type: 'SET_LOAD', value: false });
    }
  };

  // Запрос данных графика если указано время custom
  const getCustomTime = () => {
    _customTime = [dateFrom, dateTo];
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'GRAPH_REQUESTED',
      args: {
        body: { time: 'custom', customTime: _customTime },
      },
    });
  };

  // Обработчик события изменения времени
  const handleSelectChange = (event: React.ChangeEvent<{ value: any }>) => {
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    const { value } = event.target;
    _time = value;
    graphRequest(value);
    setSelectValue(value);
  };

  // Обработчик события изменения группировки
  const changeGroupBy = (e: React.ChangeEvent<{ value: any }>) => {
    const { value } = e.target;
    _group = value;
    setFirstColumn(lib.capitalizeFirstLetter(value));
    setGroupBy(value);
    tableRequest(selectValue, value);
  };

  useEffect(() => {
    let mounted = true;
    graphRequest('last-month');
    tableRequest('last-month', 'campaign');
    _loadStoreSubs = loadStore.subscribe(() => {
      setLoad(loadStore.getState().value);
    });
    _storeSubs = store.subscribe(() => {
      const state = store.getState();
      const { graphData, tableData } = state;
      if (graphData) {
        if (state.type === 'GRAPH_FAILED') {
          const { message }: any = graphData.data?.errorData;
          enqueueSnackbar(`Graph statistic: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'GRAPH_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = graphData;
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
          const { all }: any = data.body;
          if (mounted) {
            setAllStat({
              cost: all.cost,
              impressions: all.impressions,
              clicks: all.clicks,
              requests: all.requests,
            });
          }
          const { graph } = data.body;
          const pr = worker.computeGraphData(graph);
          pr.then((d: any) => {
            setGraphDataArr(d);
          });
        }
      }
      if (tableData) {
        if (state.type === 'TABLE_FAILED') {
          const { message }: any = tableData.data?.errorData;
          enqueueSnackbar(`Table statistic: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'TABLE_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = tableData;
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
          const { table, group, desc, sort } = data.body;
          _desc = desc;
          _sort = sort;
          const newLimit = data.body.limit;
          const newRowsPerPage = newLimit * data.body.current;
          _current = data.body.current;
          _limit = newLimit;
          const { length } = table;
          const pr = worker.computeTableData(table, group);
          pr.then((d: any) => {
            setRows(d);
          });
          if (length < newLimit) {
            setCount(newRowsPerPage - (newLimit - length));
            setTooltip(false);
          } else {
            setCount(newRowsPerPage + 1);
            setTooltip(true);
          }
          setIcons(getSortIcons());
        }
      }
      return 0;
    });
    return () => {
      mounted = false;
      _storeSubs();
      _loadStoreSubs();
    };
  }, []);

  return (
    <div className={clsx('full-width')}>
      <div className={clsx('dashboard-header')}>
        <ListElement title="Cost" value={allStat.cost || 0}>
          <CostIcon color="error" />
        </ListElement>
        <ListElement title="Impressions" value={allStat.impressions}>
          <ImpressionsIcon />
        </ListElement>
        <ListElement title="Requests" value={allStat.requests}>
          <RequestsIcon />
        </ListElement>
        <ListElement title="Clicks" value={allStat.clicks}>
          <ClicksIcon />
        </ListElement>
        <div className="select-time">
          <BlockSelect name="Time" value={selectValue} handleChange={handleSelectChange}>
            {times}
          </BlockSelect>
          {showDP ? (
            <div className="row-center">
              <div className={clsx('date-pickers', 'col-start')}>
                <div className={clsx('date-picker', 'row')}>
                  <DatePickerElement
                    startDate={dateFrom}
                    onChange={(date: Date) => {
                      setDateFrom(date);
                    }}
                  />
                </div>
                <div className={clsx('date-picker', 'row')}>
                  <DatePickerElement
                    startDate={dateTo}
                    onChange={(date: Date) => {
                      setDateTo(date);
                    }}
                  />
                </div>
              </div>
              {load ? (
                <BlockProgress />
              ) : (
                <IconButton onClick={getCustomTime}>
                  <SendIcon color="secondary" />
                </IconButton>
              )}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
      <Graph data={graphDataArr} />
      <div className="teble-statistic">
        <BlockSelect name="Group by" value={groupBy} handleChange={changeGroupBy}>
          {groupByOptions}
        </BlockSelect>
        <TableStatistic icons={icons} rows={rows || []} firstColumn={firstColumn} />
        <div className="row-center">
          <BlockTablePagination
            handleChangePage={(event, newPage) => {
              setPage(newPage);
              _current = newPage + 1;
              setSortAndDesc(_sort, _desc);
            }}
            handleChangeRowsPerPage={(event) => {
              const { value }: any = event.target;
              const rPP = parseInt(value, 10);
              setRowsPerPage(rPP);
              _limit = rPP;
              _current = 1;
              setPage(0);
              setSortAndDesc(_sort, _desc);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            count={count}
          />
          <div className="icon-button">
            {tooltip ? (
              <Tooltip
                title="Due to grouping, the number of pages cannot be counted"
                placement="right">
                <HelpIcon color="secondary" />
              </Tooltip>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
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
