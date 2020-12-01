/**
 * Создание кампании/оффера и их изменение
 * в зависимости от контекста вызова
 */
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
  InputAdornment,
  OutlinedInput,
  IconButton,
  TextareaAutosize,
  Card,
  CardContent,
} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup, Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import UploadIcon from '@material-ui/icons/CloudUpload';
import CreateIcon from '@material-ui/icons/Create';
import AlertMessage from '../components/AlertMessage';
import BlockPopper from '../components/BlockPopper';
import BlockSelect from '../components/BlockSelect';
import { action, loadStore, store } from '../store';
import * as lib from '../lib';
import * as Types from '../react-app-env';
import Auth from '../components/Auth';

// Для формирования ссылки изображения
const serverUrl = lib.getServerUrl();

// Для получения файлов из скрытых форм иконки и изображения
const body: any = document.querySelector('body');

// Ширина контейнера формы и расчет ширины textarea
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

const getOfferImagePath = (offerId: any): string => {
  return `/img/offers/${offerId}/`;
};

// Ограничители подписок, чтобы по нескольку раз не подписывалось на одно и тоже хранилище
let _storeSubs: any = () => {};
let _loadStoreSubs: any = () => {};
let _alignment: Types.Alignment = 'add';
let _offerIcon: Types.OfferIcon = {};
let _offerImage: Types.OfferImage = {};

// Блок обновления и создания оффера
const OfferUpdate = (props: Types.OfferUpdateProps) => {
  const {
    disabled,
    offerTitle,
    setOfferTitle,
    offerDescription,
    setOfferDescription,
    classes,
    offerId,
    offerIcon,
    offerImage,
    setOfferIcon,
    setOfferImage,
  } = props;

  const title = _alignment === 'new' ? 'Create new offer' : 'Update offer';

  useEffect(() => {}, [offerId]);

  const fullIconName = `${getOfferImagePath(offerId)}${offerIcon.name}`;
  const fullImageName = `${getOfferImagePath(offerId)}${offerImage.name}`;

  return (
    <div>
      <div className={clsx('col-center')}>
        <Typography variant="h6">{title}</Typography>
      </div>
      <br />
      <div className="col-center">
        <FormLabel>Title</FormLabel>
      </div>
      <div className={clsx('form-item')}>
        <TextField
          disabled={disabled}
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
          disabled={disabled}
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
      <div className={clsx('col-center', 'header')}>
        <FormLabel>Offer media</FormLabel>
      </div>
      <div className={clsx('form-input', 'row')}>
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography variant="h6">Insert icon</Typography>
            <Typography variant="body1">Accepted all image types</Typography>
            <div className="row-center">
              <FormLabel>Upload:</FormLabel>
              <IconButton
                disabled={disabled}
                onClick={() => {
                  const d: any = document.getElementById(`icon-${_alignment}`);
                  d.firstChild.click();
                }}>
                <UploadIcon color="secondary" />
              </IconButton>
            </div>
            {_offerIcon.name ? (
              <div>
                {_alignment === 'new' ? (
                  <Paper className={classes.padding}>
                    {offerIcon.name}
                    <IconButton
                      disabled={disabled}
                      onClick={() => {
                        _offerIcon = {};
                        setOfferIcon(_offerIcon);
                      }}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Paper>
                ) : (
                  <div className="col-center">
                    <img
                      title={offerIcon.name}
                      width={minWidth / 2 - 32}
                      alt={offerIcon.name}
                      src={`${serverUrl}${
                        offerIcon.name.match(/^\/img/) ? offerIcon.name : fullIconName
                      }`}
                    />
                    <IconButton
                      disabled={disabled}
                      onClick={() => {
                        _offerIcon = {};
                        setOfferIcon(_offerIcon);
                      }}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </div>
                )}
              </div>
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
                disabled={disabled}
                onClick={() => {
                  const d: any = document.getElementById(`image-${_alignment}`);
                  d.firstChild.click();
                }}>
                <UploadIcon color="secondary" />
              </IconButton>
            </div>
            {offerImage.name ? (
              <div>
                {_alignment === 'new' ? (
                  <Paper className={classes.padding}>
                    {offerImage.name}
                    <IconButton
                      disabled={disabled}
                      onClick={() => {
                        _offerImage = {};
                        setOfferImage(_offerImage);
                      }}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Paper>
                ) : (
                  <div className="col-center">
                    <img
                      title={offerImage.name}
                      width={minWidth / 2 - 32}
                      alt={offerImage.name}
                      src={`${serverUrl}${
                        offerImage.name.match(/^\/img/) ? offerImage.name : fullImageName
                      }`}
                    />
                    <IconButton
                      disabled={disabled}
                      onClick={() => {
                        _offerImage = {};
                        setOfferImage(_offerImage);
                      }}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </CardContent>
        </Card>
      </div>
      <div className="form-input">
        <form id={`icon-${_alignment}`}>
          <input
            name="icon"
            onChange={(e: any) => {
              const { files } = e.target;
              if (files) {
                // eslint-disable-next-line prefer-destructuring
                _offerIcon.name = files[0].name;
                setOfferIcon(files[0]);
              }
            }}
            accept="image/*"
            hidden
            type="file"
          />
        </form>
        <form id={`image-${_alignment}`}>
          <input
            name="image"
            onChange={(e: any) => {
              const { files } = e.target;
              if (files) {
                // eslint-disable-next-line prefer-destructuring
                _offerImage.name = files[0].name;
                setOfferImage(files[0]);
              }
            }}
            accept="image/*"
            hidden
            type="file"
          />
        </form>
      </div>
    </div>
  );
};

/**
 * Сборщик мусора не пропускает стейты которые не задействованы в рендере,
 * поэтому для изменения и создания камнании updateCampaign и createCampaign пришлось устроить эти пляски с замыканиями(
 */
let _campaign = {
  title: '',
  link: '',
  countries: [],
  budget: 0,
  price: 0,
  ip_pattern: [],
  white_list: [],
  black_list: [],
  offer_id: -1,
};

// eslint-disable-next-line prefer-object-spread
const _copyCampaign = Object.assign({}, _campaign);

let _oldCountries: any[] = [];
let _id: number = 0;
let _cleared = false;

/**
 * Основной компонент представлений изменения и создания кампании с изменением
 * и созданием оффера.
 * @param props
 */
export default function CreateCampaign(props: Types.CreateCampaignProps) {
  const { update } = props;
  const history: any = useHistory();
  const classes: any = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [offer, setOffer] = useState<number>(-1);
  const [offersOptions, setOffersOptions] = useState<React.ReactElement[]>([]);
  const [title, setTitle] = useState<string>('');
  const [offerIcon, setOfferIcon] = useState<any>({});
  const [offerImage, setOfferImage] = useState<any>({});
  const [offerTitle, setOfferTitle] = useState<string>('');
  const [offerDescription, setOfferDescription] = useState<string>('');
  const [link, setLink] = useState('http://');
  const [countryList, setCountryList] = useState<Types.Country[]>([]);
  const [countries, setCountries] = useState(<div> </div>);
  const [budget, setBudget] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
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
  const [showAsAdmin, setShowAsAdmin] = useState<boolean>(false);
  const _alert: Types.AlertProps = {
    message: 'Alert closed',
    status: 'info',
    open: false,
  };
  const [alert, setAlert] = useState(_alert);

  // Запрос списка стран при клике или изменению поля стран
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

  // Управляет переключателем создания/редактирования оффера
  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: any) => {
    if (newAlignment !== null) {
      _alignment = newAlignment;
      setAlignment(_alignment);
    }
  };

  const createCampaign = () => {
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'CREATE_CAMPAIGN_REQUESTED',
      args: {
        body: _campaign,
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

  const updateCampaign = () => {
    setAlert({
      open: true,
      status: 'info',
      message: 'Campaign update...',
    });
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'UPDATE_CAMPAIGN_REQUESTED',
      args: {
        id: _id,
        body: _campaign,
      },
    });
  };

  const updateOffer = () => {
    setAlert({
      open: true,
      status: 'info',
      message: 'Offer updated...',
    });
    loadStore.dispatch({ type: 'SET_LOAD', value: true });
    action({
      type: 'UPDATE_OFFER_REQUESTED',
      args: {
        id: offer,
        body: {
          title: offerTitle,
          description: offerDescription,
        },
      },
    });
  };

  /**
   * Шлет запрос на сервер для обновления изображения оффера
   * @param id {number} - ид оффера
   */
  const updateOfferImage = (id: number) => {
    const formImage: any = document.getElementById(`image-${_alignment}`);
    const formDataImage = new FormData(formImage);
    action({
      type: 'UPLOAD_OFFER_IMAGE_REQUESTED',
      args: {
        id,
        body: formDataImage,
      },
    });
  };

  /**
   * Шлет запрос на сервер для обновления иконки оффера
   * @param id {number}
   */
  const updateOfferIcon = (id: number) => {
    const formIcon: any = document.getElementById(`icon-${_alignment}`);
    const formDataIcon = new FormData(formIcon);
    action({
      type: 'UPLOAD_OFFER_ICON_REQUESTED',
      args: {
        id,
        body: formDataIcon,
      },
    });
  };

  /**
   * Запрашивает у сервера офферы пользователя
   */
  const getOffers = () => {
    action({
      type: 'GET_OFFERS_REQUESTED',
      args: {
        body: {
          self: 1, // TODO когда смотрит админ ему возвращает своих офферов
        },
      },
    });
  };

  /**
   * ставит значения в поле изменения оффера по стейту и ид оффера
   * @param state {Redux.State} - состояния хранилища store
   * @param offerId {number} - ид оффера
   */
  const setOfferValues = (state: any, offerId: number) => {
    const { getOffersData } = state;
    const { data }: any = getOffersData;
    const { offers } = data.body;
    let needOffer: any = {};
    offers.map((item: Types.Offer) => {
      if (offerId === item.id) {
        needOffer = item;
      }
      return 0;
    });
    if (!update && offerId === -1) {
      needOffer = {
        title: '',
        description: '',
      };
      _offerImage = {};
      _offerIcon = {};
    } else {
      _offerImage.name = needOffer.image;
      _offerIcon.name = needOffer.icon;
      setOfferIcon(_offerIcon);
      setOfferImage(_offerImage);
    }
    setOffer(-1);
    setOfferTitle(needOffer.title);
    setOfferDescription(needOffer.description);
  };

  useEffect(() => {
    const hL = history.listen(() => {
      _cleared = false;
    });
    // при каждам обновлении запрашивает список оффера пользователя, по событию ответа начинаются движения
    getOffers();
    _loadStoreSubs = loadStore.subscribe(() => {
      setLoad(loadStore.getState().value);
    });
    // Обработчик запросов на сервер
    _storeSubs = store.subscribe(() => {
      const state: Types.Reducer = store.getState();
      const {
        createCampaignData,
        searchCountriesData,
        getOffersData,
        createOfferData,
        uploadOfferIconData,
        uploadOfferImageData,
        getCampaignData,
        updateOfferData,
        updateCampaignData,
        userData,
      }: any = state;
      if (getCampaignData) {
        // Когда идет изменение кампании
        if (state.type === 'GET_CAMPAIGN_FAILED') {
          const { message }: any = getCampaignData.data?.errorData;
          enqueueSnackbar(`Get campaign: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'GET_CAMPAIGN_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = getCampaignData;
          if (data.result !== 'success') {
            enqueueSnackbar(data.message);
            return 1;
          }
          const { campaign } = data.body;
          // Заполняем поля значениями
          setTitle(campaign.title);
          _campaign.title = campaign.title;
          setLink(campaign.link);
          _campaign.link = campaign.link;
          _campaign.offer_id = campaign.offer_id;
          setOfferValues(state, campaign.offer_id);
          _oldCountries = JSON.parse(campaign.countries).map((item: any) => ({
            name: item,
            code: item,
          }));
          setCountryList(_oldCountries);
          _campaign.countries = JSON.parse(campaign.countries);
          const oldIpPattern = JSON.parse(campaign.ip_pattern);
          setIps(oldIpPattern);
          _campaign.ip_pattern = oldIpPattern;
          setPrice(parseFloat(campaign.price));
          _campaign.price = campaign.price;
          setBudget(parseFloat(campaign.budget));
          _campaign.budget = campaign.budget;
          const oldWhiteList = JSON.parse(campaign.white_list);
          setWhiteList(oldWhiteList);
          _campaign.white_list = oldWhiteList;
          const oldBlackList = JSON.parse(campaign.black_list);
          setBlackList(oldBlackList);
          _campaign.black_list = oldBlackList;
          setOffer(campaign.offer_id);
          _campaign.offer_id = campaign.offer_id;
          const { user }: any = userData?.data.body;
          // Когда чужую кампанию смотрит админ
          if (user.id !== campaign.user_id) {
            setShowAsAdmin(true);
          }
        }
      }
      if (updateCampaignData) {
        if (state.type === 'UPDATE_CAMPAIGN_FAILED') {
          const { message }: any = updateCampaignData.data?.errorData;
          enqueueSnackbar(`Update campaign: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'UPDATE_CAMPAIGN_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = updateCampaignData;
          setAlert({
            status: data.result,
            message: data.message,
            open: true,
          });
          getOffers();
        }
      }
      if (updateOfferData) {
        if (state.type === 'UPDATE_OFFER_FAILED') {
          const { message }: any = updateOfferData.data?.errorData;
          enqueueSnackbar(`Update offer: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'UPDATE_OFFER_SUCCEEDED') {
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = updateOfferData;
          if (data.result !== 'success') {
            enqueueSnackbar(data.message);
            return 1;
          }
          const offerId = data.body.id;
          _campaign.offer_id = offerId;
          updateOfferIcon(offerId);
          updateOfferImage(offerId);
          updateCampaign();
        }
      }
      if (createCampaignData) {
        if (state.type === 'CREATE_CAMPAIGN_FAILED') {
          const { message }: any = createCampaignData.data?.errorData;
          enqueueSnackbar(`Create campaign: ${message}`);
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
        } else if (state.type === 'CREATE_CAMPAIGN_SUCCEEDED') {
          const { data }: any = createCampaignData;
          const newAlert: any = {
            open: true,
            message: data?.message,
            status: data?.result,
          };
          setAlert(newAlert);
          if (data?.result === 'success') {
            setTimeout(() => {
              history.push(`/campaign/${data.body.campaign.id}`);
            }, 1500);
          }
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
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
                  const newCl = Object.assign(_oldCountries, countryList);
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
          // Если обновление то запрашивает кампанию
          if (update) {
            _cleared = false;
            // eslint-disable-next-line prefer-destructuring
            _id = history.location.pathname.match(/\d+$/)[0];
            action({
              type: 'GET_CAMPAIGN_REQUESTED',
              args: {
                id: _id,
              },
            });
          } else if (!_cleared) {
            _cleared = true;
            // Чистим поля и задействованые глобальные переменные, если перешли с редактирования кампании
            _oldCountries = [];
            setCountries(<div />);
            setTitle('');
            setLink('http://');
            setOfferValues(state, -1);
            setCountryList([]);
            setIps([]);
            setPrice(0);
            setBudget(0);
            setWhiteList([]);
            setBlackList([]);
            setOffer(-1);
            // eslint-disable-next-line prefer-object-spread
            _campaign = Object.assign({}, _copyCampaign);
          }
          loadStore.dispatch({ type: 'SET_LOAD', value: false });
          const { data }: any = getOffersData;
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
          // При любом контексте заполняет селектор выбора оффера
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
          // При любом контексте сначала переводит на выбор или изменение оффера
          _alignment = 'add';
          setAlignment(_alignment);
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
          // Шлет подряд на изменение картинок
          updateOfferIcon(offerId);
          updateOfferImage(offerId);
          setOffer(offerId);
          // Когда обновление кампании при новом оффере
          _campaign.offer_id = offerId;
          if (update) {
            updateCampaign();
          } else {
            getOffers();
            createCampaign();
          }
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
          // В случае ошибки выбрасывает снакбар с сообщением
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
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
          if (data?.result !== 'success') {
            enqueueSnackbar(data?.message);
            return 1;
          }
        }
      }
      return 0;
    });
    return () => {
      hL();
      _storeSubs();
      _loadStoreSubs();
    };
  }, [history.location.pathname]);

  return (
    <Auth redirect={true} roles={['admin', 'user']}>
      <div className={clsx('login-wrapper', 'col-center')}>
        <div className="header">
          <Typography variant="h4">{update ? 'Edit campaign' : 'Add new campaign'}</Typography>
        </div>
        <div className="form-item">
          <Typography>{update ? 'Change any fields' : 'Please fill in fields'}</Typography>
        </div>
        <FormGroup className={classes.root}>
          <FormLabel>Title</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              disabled={showAsAdmin}
              fullWidth
              value={title}
              onChange={(e: any) => {
                const { value } = e.target;
                setTitle(value);
                _campaign.title = value;
              }}
              type="text"
              variant="outlined"
              placeholder="title"
            />
          </div>
          <FormLabel>Link</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              disabled={showAsAdmin}
              error={linkError}
              fullWidth
              value={link}
              onChange={(e: any) => {
                const { value } = e.target;
                if (!urlReg.test(value) && value !== '') {
                  setLinkError(true);
                } else {
                  _campaign.link = value;
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
                      disabled={showAsAdmin}
                      label={item.name}
                      id={item.code}
                      onDelete={(e) => {
                        // Удаление чипа со страной из списка
                        let ele = e.target.parentElement;
                        ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                        const newC: any = countryList.filter((el) => {
                          return el.code !== ele.getAttribute('id');
                        });
                        _campaign.countries = newC.map((i: any) => i.code);
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
              disabled={showAsAdmin}
              aria-describedby="transitions-popper"
              fullWidth
              onClick={(e: any) => {
                // Запрос списка стран по значению поля, при клике
                const { value } = e.target;
                if (value !== '') {
                  changeCountries(e);
                } else {
                  setAnchorEl(null);
                }
              }}
              onChange={(e: any) => {
                // При изменении
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
              disabled={showAsAdmin}
              fullWidth
              value={price}
              onChange={(e: any) => {
                const { value }: any = e.target;
                const valueInt = parseFloat(value);
                _campaign.price = valueInt;
                setPrice(valueInt);
              }}
              type="number"
              variant="outlined"
              placeholder="price"
            />
          </div>
          <FormLabel>Day budget</FormLabel>
          <div className={clsx('form-item', 'col-center')}>
            <TextField
              disabled={showAsAdmin}
              fullWidth
              value={budget}
              onChange={(e: any) => {
                const { value }: any = e.target;
                const valueInt = parseFloat(value);
                _campaign.budget = valueInt;
                setBudget(valueInt);
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
                // Вывод чипов с ИП паттерном
                return (
                  <div key={item} className="margin-4">
                    <Chip
                      disabled={showAsAdmin}
                      label={item}
                      id={item}
                      onDelete={(e) => {
                        let ele = e.target.parentElement;
                        ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                        const newC1: any = ips.filter((el) => {
                          return el !== ele.getAttribute('id');
                        });
                        _campaign.ip_pattern = newC1;
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
              disabled={showAsAdmin}
              error={ipError}
              fullWidth
              value={ip}
              onChange={(e: any) => {
                // Проверка введенных ИП
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
                      disabled={showAsAdmin}
                      onClick={() => {
                        // клик по добавлению напечатанного ИП
                        const ipsCopy = Object.assign(ips);
                        if (ip === '') {
                          enqueueSnackbar('Empty IP not added!');
                        } else if (ipsCopy.indexOf(ip) === -1) {
                          ipsCopy.push(ip);
                          _campaign.ip_pattern = ipsCopy;
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
                      disabled={showAsAdmin}
                      label={item}
                      id={item}
                      onDelete={(e) => {
                        // Удаление при клике по крестику чипа с белыми ИП
                        let ele = e.target.parentElement;
                        ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                        const newC1: any = whiteList.filter((el) => {
                          return el !== ele.getAttribute('id');
                        });
                        _campaign.white_list = newC1;
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
              disabled={showAsAdmin}
              error={whiteIpError}
              fullWidth
              value={whiteIp}
              onChange={(e: any) => {
                // Проверка введенных белых ИП
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
                      disabled={showAsAdmin}
                      onClick={() => {
                        // Добавление белого ИП в чипы
                        const ipsCopy = Object.assign(whiteList);
                        if (whiteIp === '') {
                          enqueueSnackbar('Empty IP not added!');
                        } else if (ipsCopy.indexOf(whiteIp) === -1) {
                          ipsCopy.push(whiteIp);
                          _campaign.white_list = ipsCopy;
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
                      disabled={showAsAdmin}
                      label={item}
                      id={item}
                      onDelete={(e) => {
                        // Событие при клике крестика по чипу черных ИП
                        let ele = e.target.parentElement;
                        ele = ele.getAttribute('role') === 'button' ? ele : ele.parentElement;
                        const newC1: any = blackList.filter((el) => {
                          return el !== ele.getAttribute('id');
                        });
                        _campaign.black_list = newC1;
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
              disabled={showAsAdmin}
              error={blackIpError}
              fullWidth
              value={blackIp}
              onChange={(e: any) => {
                // Проверка введенных черных ИП
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
                      disabled={showAsAdmin}
                      onClick={() => {
                        // Добавление черного ип при клике на плюсик
                        const ipsCopy = Object.assign(blackList);
                        if (blackIp === '') {
                          enqueueSnackbar('Empty IP not added!');
                        } else if (ipsCopy.indexOf(blackIp) === -1) {
                          ipsCopy.push(blackIp);
                          setBlackList(ipsCopy);
                          _campaign.black_list = ipsCopy;
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
                <ToggleButton disabled={showAsAdmin} value="add" aria-label="left aligned">
                  Add existing <AddIcon color="secondary" />
                </ToggleButton>
                <ToggleButton disabled={showAsAdmin} value="new" aria-label="centered">
                  Create new <CreateIcon color="secondary" />
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
          <div className="form-item">
            {/** В зависимости от выбранного типа оффера вставляет селектор с формой или форму */}
            {_alignment === 'add' ? (
              <div className="col-center">
                <FormLabel>Select offer</FormLabel>
                <div className={clsx('form-item', 'col-center')}>
                  <BlockSelect
                    disabled={showAsAdmin}
                    value={offer}
                    name="Offer"
                    handleChange={(e) => {
                      const { value } = e.target;
                      const _offerId = parseInt(value, 10);
                      const state = store.getState();
                      setOfferValues(state, _offerId);
                      setTimeout(() => {
                        setOffer(_offerId);
                      }, 0);
                    }}>
                    {offersOptions}
                  </BlockSelect>
                  <br />
                  {/** Вставляет компонент обновления оффера или скелетон */}
                  {offer !== -1 ? (
                    <OfferUpdate
                      disabled={showAsAdmin}
                      offerIcon={offerIcon}
                      offerImage={offerImage}
                      setOfferIcon={setOfferIcon}
                      setOfferImage={setOfferImage}
                      offerId={offer}
                      offerDescription={offerDescription}
                      setOfferDescription={setOfferDescription}
                      offerTitle={offerTitle}
                      setOfferTitle={setOfferTitle}
                      classes={classes}
                    />
                  ) : (
                    <div className="col-center">
                      <Skeleton variant="rect" width={minWidth} height={40} />
                      <br />
                      <Skeleton variant="rect" width={minWidth} height={80} />
                      <br />
                      <div className="row-center">
                        <Skeleton variant="rect" width={minWidth / 2} height={300} />
                        <Skeleton variant="rect" width={minWidth / 2} height={300} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <OfferUpdate
                disabled={showAsAdmin}
                offerIcon={offerIcon}
                offerImage={offerImage}
                setOfferIcon={setOfferIcon}
                setOfferImage={setOfferImage}
                offerDescription={offerDescription}
                setOfferDescription={setOfferDescription}
                offerTitle={offerTitle}
                setOfferTitle={setOfferTitle}
                classes={classes}
              />
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
              disabled={showAsAdmin}
              className={classes.root}
              variant="contained"
              color="secondary"
              type="submit"
              // eslint-disable-next-line no-unused-vars
              onClick={(e: any) => {
                // Порядок действий при нажатии кнопки, в зависимости от контекста и типа оффера
                setAlert(_alert);
                loadStore.dispatch({ type: 'SET_LOAD', value: true });
                if (update) {
                  if (_alignment === 'new') {
                    createOffer();
                  } else {
                    updateOffer();
                  }
                } else if (_alignment === 'new') {
                  createOffer();
                } else {
                  createCampaign();
                }
              }}>
              {update ? 'Update' : 'Create'}
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
