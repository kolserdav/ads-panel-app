import React, { useState, useEffect, useRef } from 'react';
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
  InputAdornment,
  OutlinedInput,
  IconButton,
  TextareaAutosize,
  Card,
  CardContent,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import UploadIcon from '@material-ui/icons/CloudUpload';
import CreateIcon from '@material-ui/icons/Create';
import AlertMessage from '../components/AlertMessage';
import BlockPopper from '../components/BlockPopper';
import BlockSelect from '../components/BlockSelect';
import { action, loadStore, store } from '../store';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';

const body: any = document.querySelector('body');

const minWidth = body.clientWidth > 500 ? 500 : 300;

const useStyles = makeStyles({
  root: {
    width: `${minWidth}px`,
  },
  card: {
    width: `${minWidth / 2}px`,
  },
  padding: {
    padding: '5px',
  },
});

const ipReg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
// eslint-disable-next-line no-useless-escape
const urlReg = /^https?:\/\//;

// Ограничители подписок, чтобы по нескольку раз не подписывалось на одно и тоже хранилище
let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};

export default function CreateCampaign() {
  const iconRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line no-unused-vars
  const [offer, setOffer] = useState<number>(-1);
  const [offerIcon, setOfferIcon] = useState<any>({});
  const [offerImage, setOfferImage] = useState<any>({});
  const [offersOptions, setOffersOptions] = useState<React.ReactElement[]>([]);
  const [title, setTitle] = useState();
  const [offerTitle, setOfferTitle] = useState<string>('');
  const [offerDescription, setOfferDescription] = useState<string>('');
  const [link, setLink] = useState('http://');
  const [countryList, setCountryList] = useState<Types.Country[]>([]);
  const [countries, setCountries] = useState(<div> </div>);
  const [budget, setBudget] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [ips, setIps] = useState<string[]>([]);
  const [whiteList, setWhiteList] = useState<string[]>([]);
  const [blackList, setBlackList] = useState<string[]>([]);
  const [load, setLoad] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [ipError, setIpError] = useState<boolean>(false);
  const [whiteIpError, setWhiteIpError] = useState<boolean>(false);
  const [blackIpError, setBlackIpError] = useState<boolean>(false);
  const [linkError, setLinkError] = useState<boolean>(false);
  const [ip, setIp] = useState<string>('');
  const [whiteIp, setWhiteIp] = useState<string>('');
  const [blackIp, setBlackIp] = useState<string>('');
  const [alignment, setAlignment] = React.useState('add');
  const _alert: Types.AlertProps = {
    message: 'Alert closed',
    status: 'info',
    open: false,
  };
  const [alert, setAlert] = useState(_alert);

  const changeCountries = (e: any) => {
    setAnchorEl(e.currentTarget);
    action({
      type: 'SEARCH_COUNTRIES_REQUESTED',
      args: {
        params: {
          search: e.target.value,
        },
      },
    });
  };

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string | null) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const createCampaign = () => {
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'CREATE_CAMPAIGN_REQUESTED',
      args: {
        body: {
          title,
          link,
          countries: countryList.map((item: any) => item.code),
          budget,
          price,
          ip_pattern: ips,
          white_list: whiteList,
          black_list: blackList,
          offer_id: offer,
        },
      },
    });
  };

  const createOffer = () => {
    setAlert({
      open: true,
      status: 'info',
      message: 'Offer created...',
    });
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'CREATE_OFFER_REQUESTED',
      args: {
        body: {
          title: offerTitle,
          description: offerDescription,
        },
      },
    });
  };

  const getOffers = () => {
    action({
      type: 'GET_OFFERS_REQUESTED',
      args: {
        body: {
          self: 1,
        },
      },
    });
  };

  useEffect(() => {
    getOffers();
    _loadStoreSubs = loadStore.subscribe(() => {
      setLoad(loadStore.getState().value);
    });
    // Обработчик запроса на сервер
    _storeSubs = store.subscribe(() => {
      const state: Types.Reducer = store.getState();
      const {
        createCampaignData,
        searchCountriesData,
        getOffersData,
        createOfferData,
        uploadOfferIconData,
        uploadOfferImageData,
      } = state;
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
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
          const _countries = data?.body?.countries.map((item: any) => {
            return (
              <MenuItem
                onClick={(e: any) => {
                  const { target } = e;
                  const code = target.getAttribute('id');
                  const name = target.getAttribute('value');
                  const newCl = Object.assign(countryList);
                  let checkContry = false;
                  newCl.map((item1: any) => {
                    if (code === item1.code) checkContry = true;
                    return 0;
                  });
                  if (!checkContry) {
                    newCl.push({
                      name,
                      code,
                    });
                    setCountryList(newCl);
                    setAnchorEl(null);
                  } else {
                    enqueueSnackbar(`${name} added earlier!`);
                  }
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
      if (getOffersData) {
        if (state.type === 'GET_OFFERS_FAILED') {
          const { message }: any = getOffersData.data?.errorData;
          enqueueSnackbar(`Get offers: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'GET_OFFERS_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = getOffersData;
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
          let myOffers = data.body.offers;
          myOffers = myOffers.map((item: Types.Offer) => {
            return (
              <MenuItem key={item.id} value={item.id} selected={offer === item.id}>
                {item.title}
              </MenuItem>
            );
          });
          myOffers.unshift(
            <MenuItem key={-1} value={-1} selected={offer === -1}>
              No selected
            </MenuItem>
          );
          setOffersOptions(myOffers);
          setOffer(offer);
          setOfferTitle('');
          setOfferDescription('');
          setOfferIcon({});
          setOfferImage({});
          setAlignment('add');
        }
      }
      if (createOfferData) {
        if (state.type === 'CREATE_OFFER_FAILED') {
          const { message }: any = createOfferData.data?.errorData;
          enqueueSnackbar(`Create offer: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'CREATE_OFFER_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = createOfferData;
          setAlert({
            open: true,
            status: data?.result,
            message: data?.message,
          });
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
          enqueueSnackbar(data.message);
          const offerId = data.body.offer.id;
          setOffer(offerId);
          if (offerIcon.name) {
            const formIcon: any = document.getElementById('icon');
            const formDataIcon = new FormData(formIcon);
            action({
              type: 'UPLOAD_OFFER_ICON_REQUESTED',
              args: {
                id: offerId,
                body: formDataIcon,
              },
            });
          }
          if (offerImage.name) {
            const formImage: any = document.getElementById('image');
            const formDataImage = new FormData(formImage);
            action({
              type: 'UPLOAD_OFFER_IMAGE_REQUESTED',
              args: {
                id: offerId,
                body: formDataImage,
              },
            });
          }
          getOffers();
          createCampaign();
        }
      }
      if (uploadOfferIconData) {
        if (state.type === 'UPLOAD_OFFER_ICON_FAILED') {
          const { message }: any = uploadOfferIconData.data?.errorData;
          enqueueSnackbar(`Upload offer icon: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'UPLOAD_OFFER_ICON_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = uploadOfferIconData;
          if (data.result !== 'success') {
            enqueueSnackbar(data?.message);
          }
        }
      }
      if (uploadOfferImageData) {
        if (state.type === 'UPLOAD_OFFER_IMAGE_FAILED') {
          const { message }: any = uploadOfferImageData.data?.errorData;
          enqueueSnackbar(`Upload offer image: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'UPLOAD_OFFER_IMAGE_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = uploadOfferImageData;
          if (data.result !== 'success') {
            enqueueSnackbar(data?.message);
          }
        }
      }
      return 0;
    });
    return () => {
      _storeSubs();
      _loadStoreSubs();
    };
  }, [offer]);

  return (
    <Auth redirect={true} roles={['admin', 'user']}>
      <div className={clsx('login-wrapper', 'col-center')}>
        <div className="header">
          <Typography variant="h4">Add new campaign</Typography>
        </div>
        <div className="form-item">
          <Typography>Please fill in all fields</Typography>
        </div>
        <FormGroup className={classes.root}>
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
              error={linkError}
              fullWidth
              defaultValue={link}
              onChange={(e: any) => {
                const { value } = e.target;
                if (!urlReg.test(value) && value !== '') {
                  setLinkError(true);
                } else {
                  setLink(value);
                  setLinkError(false);
                }
              }}
              type="text"
              variant="outlined"
              placeholder="link"
            />
          </div>
          <FormLabel>Countries</FormLabel>
          <Paper>
            <div className="wrap-center">
              {countryList.map((item: Types.Country) => {
                return (
                  <div key={item.code} className="margin-4">
                    <Chip
                      label={item.name}
                      id={item.code}
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
                  </div>
                );
              })}
            </div>
          </Paper>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              aria-describedby="transitions-popper"
              fullWidth
              onClick={(e: any) => {
                const { value } = e.target;
                if (value !== '') {
                  changeCountries(e);
                } else {
                  setAnchorEl(null);
                }
              }}
              onChange={(e: any) => {
                const { value } = e.target;
                if (value !== '') {
                  changeCountries(e);
                } else {
                  setAnchorEl(null);
                }
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
                const { value }: any = e.target;
                setPrice(parseFloat(value));
              }}
              type="number"
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
                const { value }: any = e.target;
                setBudget(parseFloat(value));
              }}
              type="number"
              variant="outlined"
              placeholder="budget"
            />
          </div>
          <FormLabel>IP&apos;s</FormLabel>
          <Paper>
            <div className="wrap-center">
              {ips.map((item: string) => {
                return (
                  <div key={item} className="margin-4">
                    <Chip
                      label={item}
                      id={item}
                      onDelete={(e) => {
                        let ele = e.target.parentElement;
                        ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                        const newC1 = ips.filter((el) => {
                          return el !== ele.getAttribute('id');
                        });
                        setIps(newC1);
                      }}
                      color="secondary"
                    />
                  </div>
                );
              })}
            </div>
          </Paper>
          <div className={clsx('form-item', 'col-center')}>
            <OutlinedInput
              error={ipError}
              fullWidth
              value={ip}
              onChange={(e: any) => {
                const { value } = e.target;
                setIp(value);
                if (value === '') {
                  setIpError(false);
                  return 0;
                }
                if (!ipReg.test(value)) {
                  setIpError(true);
                  return 1;
                }
                setIpError(false);
                return 0;
              }}
              type="text"
              placeholder="IP's pattern"
              endAdornment={
                !ipError ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        const ipsCopy = Object.assign(ips);
                        if (ip === '') {
                          enqueueSnackbar('Empty IP not added!');
                        } else if (ipsCopy.indexOf(ip) === -1) {
                          ipsCopy.push(ip);
                          setIps(ipsCopy);
                          setIp('');
                        } else {
                          enqueueSnackbar(`${ip} will added earlier!`);
                        }
                      }}>
                      <AddIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ''
                )
              }
            />
          </div>
          <FormLabel>White list</FormLabel>
          <Paper>
            <div className="wrap-center">
              {whiteList.map((item: string) => {
                return (
                  <div key={item} className="margin-4">
                    <Chip
                      label={item}
                      id={item}
                      onDelete={(e) => {
                        let ele = e.target.parentElement;
                        ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                        const newC1 = whiteList.filter((el) => {
                          return el !== ele.getAttribute('id');
                        });
                        setWhiteList(newC1);
                      }}
                      color="secondary"
                    />
                  </div>
                );
              })}
            </div>
          </Paper>
          <div className={clsx('form-item', 'col-center')}>
            <OutlinedInput
              error={whiteIpError}
              fullWidth
              value={whiteIp}
              onChange={(e: any) => {
                const { value } = e.target;
                setWhiteIp(value);
                if (value === '') {
                  setWhiteIpError(false);
                  return 0;
                }
                if (!ipReg.test(value)) {
                  setWhiteIpError(true);
                  return 1;
                }
                setWhiteIpError(false);
                return 0;
              }}
              type="text"
              placeholder="White IP list"
              endAdornment={
                !whiteIpError ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        const ipsCopy = Object.assign(whiteList);
                        if (whiteIp === '') {
                          enqueueSnackbar('Empty IP not added!');
                        } else if (ipsCopy.indexOf(whiteIp) === -1) {
                          ipsCopy.push(whiteIp);
                          setWhiteList(ipsCopy);
                          setWhiteIp('');
                        } else {
                          enqueueSnackbar(`${whiteIp} will added earlier!`);
                        }
                      }}>
                      <AddIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ''
                )
              }
            />
          </div>
          <FormLabel>Black list</FormLabel>
          <Paper>
            <div className="wrap-center">
              {blackList.map((item: string) => {
                return (
                  <div key={item} className="margin-4">
                    <Chip
                      label={item}
                      id={item}
                      onDelete={(e) => {
                        let ele = e.target.parentElement;
                        ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                        const newC1 = blackList.filter((el) => {
                          return el !== ele.getAttribute('id');
                        });
                        setBlackList(newC1);
                      }}
                      color="secondary"
                    />
                  </div>
                );
              })}
            </div>
          </Paper>
          <div className={clsx('form-item', 'col-center')}>
            <OutlinedInput
              error={blackIpError}
              fullWidth
              value={blackIp}
              onChange={(e: any) => {
                const { value } = e.target;
                setBlackIp(value);
                if (value === '') {
                  setBlackIpError(false);
                  return 0;
                }
                if (!ipReg.test(value)) {
                  setBlackIpError(true);
                  return 1;
                }
                setBlackIpError(false);
                return 0;
              }}
              type="text"
              placeholder="Black IP list"
              endAdornment={
                !blackIpError ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        const ipsCopy = Object.assign(blackList);
                        if (blackIp === '') {
                          enqueueSnackbar('Empty IP not added!');
                        } else if (ipsCopy.indexOf(blackIp) === -1) {
                          ipsCopy.push(blackIp);
                          setBlackList(ipsCopy);
                          setBlackIp('');
                        } else {
                          enqueueSnackbar(`${blackIp} will added earlier!`);
                        }
                      }}>
                      <AddIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  ''
                )
              }
            />
          </div>
          <div className="col-center">
            <FormLabel>Offer</FormLabel>
            <div className="form-item">
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment">
                <ToggleButton value="add" aria-label="left aligned">
                  Add existing <AddIcon color="secondary" />
                </ToggleButton>
                <ToggleButton value="new" aria-label="centered">
                  Create new <CreateIcon color="secondary" />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
          <div className="form-item">
            {alignment === 'add' ? (
              <div className="col-center">
                <FormLabel>Select offer</FormLabel>
                <div className="form-item">
                  <BlockSelect
                    value={offer}
                    name="Offer"
                    handleChange={(e) => {
                      const { value } = e.target;
                      setOffer(value);
                    }}>
                    {offersOptions}
                  </BlockSelect>
                </div>
              </div>
            ) : (
              <div>
                <div className={clsx('col-center')}>
                  <Typography variant="h6">Create new offer</Typography>
                </div>
                <br />
                <div className="col-center">
                  <FormLabel>Title</FormLabel>
                </div>
                <div className={clsx('form-item')}>
                  <TextField
                    fullWidth
                    defaultValue={offerTitle}
                    onChange={(e: any) => {
                      const { value }: any = e.target;
                      setOfferTitle(value);
                    }}
                    type="text"
                    variant="outlined"
                    placeholder="offer title"
                  />
                </div>
                <div className="col-center">
                  <FormLabel>Description</FormLabel>
                </div>
                <div className={clsx('form-item', 'col-center')}>
                  <TextareaAutosize
                    value={offerDescription}
                    onChange={(e: any) => {
                      const { value } = e.target;
                      setOfferDescription(value);
                    }}
                    aria-label="minimum height"
                    rowsMin={3}
                    cols={minWidth / 10}
                    placeholder="Offer description"
                  />
                </div>
                <div className={clsx('form-input', 'row')}>
                  <Card className={classes.card} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Insert icon</Typography>
                      <Typography variant="body1">Accepted all image types</Typography>
                      <div className="row-center">
                        <FormLabel>Upload:</FormLabel>
                        <IconButton
                          onClick={() => {
                            if (iconRef !== null) {
                              iconRef.current?.click();
                            }
                          }}>
                          <UploadIcon color="secondary" />
                        </IconButton>
                      </div>
                      {offerIcon.name ? (
                        <Paper className={classes.padding}>
                          {offerIcon.name}
                          <IconButton
                            onClick={() => {
                              setOfferIcon({});
                            }}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Paper>
                      ) : (
                        ''
                      )}
                    </CardContent>
                  </Card>
                  <Card className={classes.card} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Insert image</Typography>
                      <Typography variant="body1">Accepted all image types</Typography>
                      <div className="row-center">
                        <FormLabel>Upload:</FormLabel>
                        <IconButton
                          onClick={() => {
                            if (imageRef !== null) {
                              imageRef.current?.click();
                            }
                          }}>
                          <UploadIcon color="secondary" />
                        </IconButton>
                      </div>
                      {offerImage.name ? (
                        <Paper className={classes.padding}>
                          {offerImage.name}
                          <IconButton
                            onClick={() => {
                              setOfferImage({});
                            }}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Paper>
                      ) : (
                        ''
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className="form-input">
                  <form id="icon">
                    <input
                      name="icon"
                      onChange={(e: any) => {
                        const { files } = e.target;
                        if (files) setOfferIcon(files[0]);
                      }}
                      accept="image/*"
                      hidden
                      type="file"
                      ref={iconRef}
                    />
                  </form>
                  <form id="image">
                    <input
                      name="image"
                      onChange={(e: any) => {
                        const { files } = e.target;
                        if (files) setOfferImage(files[0]);
                      }}
                      accept="image/*"
                      hidden
                      type="file"
                      ref={imageRef}
                    />
                  </form>
                </div>
              </div>
            )}
          </div>
        </FormGroup>
        <div className="form-item">
          <br />
          <br />
          {load ? (
            <CircularProgress />
          ) : (
            <Button
              className={classes.root}
              variant="contained"
              color="secondary"
              type="submit"
              // eslint-disable-next-line no-unused-vars
              onClick={(e: any) => {
                setAlert(_alert);
                loadStore.dispatch({ type: 'SET_LOAD', value: true });
                if (alignment === 'new') {
                  createOffer();
                } else {
                  createCampaign();
                }
              }}>
              Save
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
