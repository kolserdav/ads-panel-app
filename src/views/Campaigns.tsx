import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Typography, MenuItem } from '@material-ui/core';
// @ts-ignore
import Worker from 'comlink-loader!../worker/index';
import TableCampaigns from '../components/TableCampaigns';
import Auth from '../components/Auth';
import BlockSelect from '../components/BlockSelect';
import BlockDialog from '../components/Dialog';
import Pagination from '../components/Pagination';
import { store, action, loadStore } from '../store';
import * as Types from '../react-app-env';

const worker = new Worker();

let _status: Types.CampaignStatus = 'pending'; // Дле передачи статуса из DialogContent в Campaigns
let _storeSubs: any = () => {};

/**
 * Контент диалога смены статуса кампании
 * @param props
 */
const DialogContent = (props: Types.DialogContentProps) => {
  const { statusInit, name, options } = props;
  const [status, setStatus]: any = useState(statusInit);

  const changeStatus = (e: any) => {
    const { value } = e.target;
    _status = value;
    setStatus(value);
  };

  return (
    <div className="col-center">
      <Typography variant="body1">You are changed campaign: &quot;{name}&quot;</Typography>
      <br />
      <div className="margin-3">
        <BlockSelect name="Status" value={status} handleChange={changeStatus}>
          {options}
        </BlockSelect>
      </div>
    </div>
  );
};

const campaignStatuses: Types.CampaignStatus[] = ['active', 'pause', 'pending', 'budget'];

export default function Statuses() {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows]: any = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const _dialog: Types.DialogState = {
    open: false,
    title: 'Dialog closed',
    content: '',
    id: 0,
    handleAccept: () => {},
  };
  const [dialog, setDialog]: any = useState(_dialog);
  const [changed, setChanged]: any = useState(false);

  const handleCloseDialog = () => {
    setDialog(_dialog);
  };

  useEffect(() => {}, []);

  const changeCampaignStatus = (id: number) => {
    return () => {
      loadStore.dispatch({ type: 'SET_LOAD', value: true });
      action({
        type: 'CHANGE_CAMPAIGN_STATUS_REQUESTED',
        args: {
          body: {
            status: _status,
          },
          id,
        },
      });
    };
  };

  const deleteCampaign = (id: number) => {
    action({
      type: 'DELETE_CAMPAIGN_REQUESTED',
      args: {
        id,
      },
    });
  };

  const getCampaigns = (limit: number, current: number) => {
    action({
      type: 'GET_CAMPAIGNS_REQUESTED',
      args: {
        body: {
          limit,
          current: current + 1,
        },
      },
    });
  };

  useEffect(() => {
    getCampaigns(rowsPerPage, page);
    _storeSubs = store.subscribe(() => {
      const state = store.getState();
      const { getCampaignsData, changeCampaignStatusData, deleteCampaignData } = state;
      if (getCampaignsData) {
        if (state.type === 'GET_CAMPAIGNS_FAILED') {
          const { message }: any = getCampaignsData.data?.errorData;
          enqueueSnackbar(`Get campaigns: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'GET_CAMPAIGNS_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data } = getCampaignsData;
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
          const { body }: any = data;
          const { campaigns }: any = body;
          const _count: any = body.count;
          setCount(_count);
          const pr = worker.computeAdminCampaignsData(campaigns);
          pr.then((d: Types.TableCampaignsRow[]) => {
            setRows(d);
          });
        }
      }
      if (changeCampaignStatusData) {
        if (state.type === 'CHANGE_CAMPAIGN_STATUS_FAILED') {
          const { message }: any = changeCampaignStatusData.data?.errorData;
          enqueueSnackbar(`Change campaign status: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'CHANGE_CAMPAIGN_STATUS_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = changeCampaignStatusData;
          if (data.result !== 'success') {
            enqueueSnackbar(data.message);
            return 1;
          }
          setChanged(!changed);
          setDialog(_dialog);
        }
      }
      if (deleteCampaignData) {
        if (state.type === 'DELETE_CAMPAIGN_FAILED') {
          const { message }: any = deleteCampaignData.data?.errorData;
          enqueueSnackbar(`Delete campaign: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'DELETE_CAMPAIGN_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = deleteCampaignData;
          enqueueSnackbar(data.message);
          if (data.result === 'success') {
            setDialog(_dialog);
            setChanged(!changed);
          }
        }
      }
      return 0;
    });
    return () => {
      _storeSubs();
    };
  }, [changed]);

  return (
    <Auth roles={['admin', 'user']} redirect={true}>
      <div className="header">
        <Typography variant="h4">Campaign list</Typography>
      </div>
      <TableCampaigns
        handleChangeStatus={(statusProp: Types.CampaignStatus, name: string, id: number) => {
          const options: React.ReactElement[] = campaignStatuses.map(
            (item: Types.CampaignStatus) => {
              return (
                <MenuItem key={item} value={item} selected={item === statusProp}>
                  {item}
                </MenuItem>
              );
            }
          );
          return () => {
            setDialog({
              id,
              open: true,
              title: 'Change status of campaign',
              content: <DialogContent statusInit={statusProp} name={name} options={options} />,
              handleAccept: changeCampaignStatus(id),
            });
          };
        }}
        handleDelete={(name: string, id: number) => {
          return () => {
            setDialog({
              id,
              open: true,
              title: 'Delete campaign?',
              content: (
                <Typography variant="body1">
                  If you click <b>Yes</b>, the campaign titled &ldquo;<i>{name}</i>&rdquo; will be
                  deleted!
                </Typography>
              ),
              handleAccept: () => {
                deleteCampaign(id);
              },
            });
          };
        }}
        rows={rows}
      />
      <Pagination
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
        handleChangePage={(event, newPage) => {
          setPage(newPage);
          getCampaigns(rowsPerPage, newPage);
        }}
        handleChangeRowsPerPage={(event) => {
          const { value }: any = event.target;
          setRowsPerPage(value);
          setPage(0);
          getCampaigns(value, 0);
        }}
      />
      <BlockDialog
        open={dialog.open}
        title={dialog.title}
        content={dialog.content}
        handleClose={handleCloseDialog}
        handleAccept={dialog.handleAccept}
      />
    </Auth>
  );
}
