import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import DashboardIcon from '@material-ui/icons/ShowChart';
import LoginIcon from '@material-ui/icons/Input';
import RegistrationIcon from '@material-ui/icons/PersonAdd';
import HomeIcon from '@material-ui/icons/Home';
import CampaignsIcon from '@material-ui/icons/LineStyle';
import ProfileIcon from '@material-ui/icons/AccountBox';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import CreateIcon from '@material-ui/icons/Queue';
import { Link, useHistory } from 'react-router-dom';
import { LinearProgress } from '@material-ui/core';
import { Cookies } from 'react-cookie';
import AlertDialog from './Dialog';
import { loadStore, store } from '../store';
import Auth from './Auth';
import * as Types from '../react-app-env';

const cookies = new Cookies();

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

let _load = true;
let _storeSubs: any = () => {};

export default function Panel(props: Types.PanelProps) {
  const history = useHistory();
  const { pathname } = history.location;
  const { children, window, namePage } = props;
  // @ts-ignore
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [load, setLoad] = React.useState(true);
  const [id, setId] = useState<number>(-1);
  const dialog: Types.DialogProps = {
    open: false,
    title: 'Closed...',
    content: 'Dialog closed...',
    handleClose: () => {},
    handleAccept: () => {},
  };
  const [alert, setAlert] = React.useState(dialog);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    _storeSubs = store.subscribe(() => {
      const state: any = store.getState().userData;
      if (state) {
        if (state.type === 'USER_FETCH_SUCCEEDED') {
          setId(state.data?.body.user.id);
        }
      }
    });
    loadStore.subscribe(() => {
      const { value }: any = loadStore.getState();
      if (value !== _load) {
        setLoad(value);
        _load = value;
      }
    });
    return () => {
      _storeSubs();
    };
  }, [load, id]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <HideOnScroll window={window}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              {namePage}
            </Typography>
          </Toolbar>
          {load ? <LinearProgress /> : ''}
        </AppBar>
      </HideOnScroll>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Auth redirect={false} roles={['admin', 'user']}>
            <Link className="menu-link" to="/dashboard">
              <ListItem button selected={pathname === '/dashboard'}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>
          </Auth>
        </List>
        <Divider />
        <List>
          <Auth redirect={false} roles={['guest']}>
            <Link className="menu-link" to="/">
              <ListItem button selected={pathname === '/'}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>
          </Auth>
          <Auth redirect={false} roles={['admin', 'user']}>
            <Link className="menu-link" to="/campaigns">
              <ListItem button selected={pathname === '/campaigns'}>
                <ListItemIcon>
                  <CampaignsIcon />
                </ListItemIcon>
                <ListItemText primary="Campaigns" />
              </ListItem>
            </Link>
          </Auth>
          <Auth redirect={false} roles={['user', 'admin']}>
            <Link className="menu-link" to="/new-campaign">
              <ListItem button selected={pathname === '/new-campaign'}>
                <ListItemIcon>
                  <CreateIcon />
                </ListItemIcon>
                <ListItemText primary="Add campaign" />
              </ListItem>
            </Link>
          </Auth>
        </List>
        <Divider />
        <List>
          <Auth redirect={false} roles={['guest']}>
            <Link className="menu-link" to="/login">
              <ListItem button selected={pathname === '/login'}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
            </Link>
          </Auth>
          <Auth redirect={false} roles={['guest']}>
            <Link className="menu-link" to="/registration">
              <ListItem button selected={pathname === '/registration'}>
                <ListItemIcon>
                  <RegistrationIcon />
                </ListItemIcon>
                <ListItemText primary="Registration" />
              </ListItem>
            </Link>
          </Auth>
          <Auth redirect={false} roles={['admin', 'user']}>
            <Link className="menu-link" to={`/profile/${id}`}>
              <ListItem button selected={pathname.match(/^\/profile\/\d+$/) !== null}>
                <ListItemIcon>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            </Link>
          </Auth>
          <Auth redirect={false} roles={['admin', 'user']}>
            <ListItem
              button
              onClick={() => {
                setAlert({
                  open: true,
                  title: 'You need logout?',
                  content:
                    'If you click yes then your session will be ended and you will be redirected to the start page.',
                  handleClose: () => {
                    setAlert(dialog);
                  },
                  handleAccept: () => {
                    cookies.remove('_qt', { path: '/' });
                    setAlert(dialog);
                    setTimeout(() => {
                      window().location.href = '/';
                    }, 300);
                  },
                });
              }}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </Auth>
        </List>
        <AlertDialog
          open={alert.open}
          title={alert.title}
          content={alert.content}
          handleAccept={alert.handleAccept}
          handleClose={alert.handleClose}
        />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}>
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
}
