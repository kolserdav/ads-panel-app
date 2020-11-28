import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  FormLabel,
  FormGroup,
  CircularProgress,
  MenuItem,
  Paper,
  Chip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import AlertMessage from '../components/AlertMessage';
import BlockPopper from '../components/BlockPopper';
import { action, loadStore, store } from '../store';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';

const body: any = document.querySelector('body');

const minWidth = body.clientWidth > 500 ? '500px' : '300px';

const useStyles = makeStyles({
  root: {
    minWidth,
  },
});

// Ограничители подписок, чтобы по нескольку раз не подписывалось на одно и тоже хранилище
let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};

export default function CreateCampaign() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line no-unused-vars
  const [title, setTitle] = useState();
  const [link, setLink] = useState();
  const [countryList, setCountryList] = useState<Types.Country[]>([]);
  const [countries, setCountries] = useState(<div> </div>);
  const [budget, setBudget] = useState();
  const [price, setPrice] = useState();
  const [ips, setIps] = useState();
  const [whiteList, setWhiteList] = useState();
  const [blackList, setBlackList] = useState();
  const [offer, setOffer] = useState();
  const [load, setLoad] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const _alert: Types.AlertProps = {
    message: 'Alert closed',
    status: 'info',
    open: false,
  };
  const [alert, setAlert] = useState(_alert);

  useEffect(() => {
    _loadStoreSubs = loadStore.subscribe(() => {
      setLoad(loadStore.getState().value);
    });
    // Обработчик запроса на сервер
    _storeSubs = store.subscribe(() => {
      const state: Types.Reducer = store.getState();
      const { createCampaignData, searchCountriesData } = state;
      if (createCampaignData) {
        if (state.type === 'CREATE_CAMPAIGN_FAILED') {
          const { message }: any = createCampaignData.data?.errorData;
          enqueueSnackbar(`Registration: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'CREATE_CAMPAIGN_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data } = createCampaignData;
          const newAlert: any = {
            open: true,
            message: data?.message,
            status: data?.result,
          };
          setAlert(newAlert);
          if (data?.result === 'success') {
            //
          }
          console.log(data)
          // TODO
        }
      }
      if (searchCountriesData) {
        if (state.type === 'SEARCH_COUNTRIES_FAILED') {
          const { message }: any = searchCountriesData.data?.errorData;
          enqueueSnackbar(`Search country: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'SEARCH_COUNTRIES_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = searchCountriesData;
          const _countries = data?.body?.countries.map((item: any) => {
            return (
              <MenuItem
                onClick={(e: any) => {
                  const { target } = e;
                  const code = target.getAttribute('id');
                  const name = target.getAttribute('value');
                  const newCl = Object.assign(countryList);
                  newCl.push({
                    name,
                    code,
                  });
                  setCountryList(newCl);
                  setAnchorEl(null);
                }}
                id={item.code}
                value={item.name}
                key={item.code}>
                {item.name}
              </MenuItem>
            );
          });
          setCountries(() => (
            <div className="popper">
              <Paper>{_countries}</Paper>
            </div>
          ));
        }
      }
    });
    return () => {
      _storeSubs();
      _loadStoreSubs();
    };
  }, [countryList]);

  return (
    <Auth redirect={true} roles={['admin', 'user']}>
      <div className={clsx('login-wrapper', 'col-center')}>
        <div className="header">
          <Typography variant="h4">Add new campaign</Typography>
        </div>
        <div className="form-item">
          <Typography>Please fill in all fields</Typography>
        </div>
        <FormGroup classes={classes}>
          <FormLabel>Title</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={title}
              onChange={(e: any) => {
                setTitle(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="title"
            />
          </div>
          <FormLabel>Link</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={link}
              onChange={(e: any) => {
                setLink(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="link"
            />
          </div>
          <FormLabel>Countries</FormLabel>
          <div>
            {countryList.map((item: Types.Country) => {
              return (
                <Chip
                  label={item.name}
                  id={item.code}
                  key={item.code}
                  onDelete={(e) => {
                    let ele = e.target.parentElement;
                    ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                    const newC = countryList.filter((el) => {
                      return el.code !== ele.getAttribute('id');
                    });
                    setCountryList(newC);
                  }}
                  color="secondary"
                />
              );
            })}
          </div>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              aria-describedby="transitions-popper"
              fullWidth
              onChange={(e: any) => {
                setAnchorEl(e.currentTarget);
                action({
                  type: 'SEARCH_COUNTRIES_REQUESTED',
                  args: {
                    params: {
                      search: e.target.value,
                    },
                  },
                });
              }}
              type="text"
              variant="outlined"
              placeholder="countries"
            />
            <BlockPopper anchorEl={anchorEl} content={countries} />
          </div>
          <FormLabel>Price</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={price}
              onChange={(e: any) => {
                setPrice(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="price"
            />
          </div>
          <FormLabel>Day budget</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={budget}
              onChange={(e: any) => {
                setBudget(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="budget"
            />
          </div>
          <FormLabel>IP&apos;s</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={ips}
              onChange={(e: any) => {
                setIps(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="company"
            />
          </div>
          <FormLabel>White list</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={whiteList}
              onChange={(e: any) => {
                setWhiteList(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="skype"
            />
          </div>
          <FormLabel>Black list</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={blackList}
              onChange={(e: any) => {
                setBlackList(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="skype"
            />
          </div>
          <FormLabel>Offer</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              fullWidth
              defaultValue={offer}
              onChange={(e: any) => {
                setOffer(e.target.value);
              }}
              type="text"
              variant="outlined"
              placeholder="offer"
            />
          </div>
        </FormGroup>
        <div className="form-item">
          {load ? (
            <CircularProgress />
          ) : (
            <Button
              classes={classes}
              variant="contained"
              color="secondary"
              type="submit"
              // eslint-disable-next-line no-unused-vars
              onClick={(e: any) => {
                setAlert(_alert);
                loadStore.dispatch({ type: 'SET_LOAD', value: true });
                action({
                  type: 'CREATE_CAMPAIGN_REQUESTED',
                  args: {
                    body: {
                      title,
                      link,
                      countries,
                      budget,
                      price,
                      ips,
                      white_list: whiteList,
                      black_list: blackList,
                      offer,
                    },
                  },
                });
              }}>
              Send
            </Button>
          )}
        </div>
        <div className="form-item">
          {alert.open ? <AlertMessage message={alert.message} status={alert.status} /> : ''}
        </div>
      </div>
    </Auth>
  );
}