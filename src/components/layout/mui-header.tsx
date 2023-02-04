import React, { MouseEventHandler, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/user';
import { RootState, UserState } from '../../models/state-types';
import { useHistory, withRouter } from 'react-router';
import ShowFirstChild from '../utils/show-first-child';
import Avatar from '@material-ui/core/Avatar';
import favicon from '../../assets/images/favicon.png';
import { MdDarkMode, MdWbSunny } from 'react-icons/md'
import { toggleDarkMode } from './styles';
import classes from './mui-header.module.scss';

const MuiHeader = ({
  onThemeChange,
  darkModeIsEnabled
}: { onThemeChange: MouseEventHandler, darkModeIsEnabled: boolean }) => {


  const dispatch = useDispatch();
  const history = useHistory();
  const { data: user, isLoggedIn = false } = useSelector<RootState, UserState>(state => state.user);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      classes={{ paper: classes.menu }}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      getContentAnchorEl={null}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Log out</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  return (
    <div className={classes.header}>
      <Typography
        onClick={() => history.push('/')}
        className={classes.logo}
        variant="h6"
        noWrap
      >
        <img className={classes.img} src={favicon} />
        <strong className={classes.title}>Scrum Poker</strong>
      </Typography>
      <div className={classes.grow} />
      <div className={classes.sectionDesktop}>
        <ShowFirstChild inCase={isLoggedIn}>
          <div className={classes.loggedIn}>
            <div onClick={onThemeChange}>
              {darkModeIsEnabled
                ? <MdWbSunny className={classes.lightIcon} size="1.5rem" title="Enable Light Mode" />
                : <MdDarkMode className={classes.darkIcon} size="1.5rem" title="Enable Dark Mode" />}
            </div>

            <Avatar
              className={classes.avatar}
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              src={user?.pictureUrl}
              alt={`${user?.username || user?.name} (${user?.email})`}
              title={`${user?.username || user?.name} (${user?.email})`}
            >
              <strong>{(user?.username || user?.name || '')[0]}</strong>
            </Avatar>
          </div>
        </ShowFirstChild>
      </div>
      <div className={classes.sectionMobile}>
        <IconButton
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <ShowFirstChild inCase={isLoggedIn}>
            <MoreIcon />
          </ShowFirstChild>
        </IconButton>
      </div>
      {renderMenu}
    </div>
  );
};

export default MuiHeader;