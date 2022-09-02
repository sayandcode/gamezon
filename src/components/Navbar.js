import React, { useContext, useState } from 'react';
import {
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import PropTypes from 'prop-types';
import Logo from './Logo';
import { UserContext } from '../utlis/Contexts/UserData/UserContext';
import { auth } from '../utlis/firebase-config';
import { NotificationSnackbarContext } from '../utlis/Contexts/NotificationSnackbarContext';
import HideOnScroll from '../utlis/HideOnScroll';
import { LoginModalContext } from '../utlis/Contexts/LoginModalContext';
import SearchBox from './SearchBox/SearchBox';

const Navbar = React.forwardRef((props, ref) => {
  return (
    <HideOnScroll>
      <AppBar position="sticky" sx={{ bgcolor: 'primary.dark' }} ref={ref}>
        <Toolbar>
          <Logo
            variant="h3"
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          />
          <SearchBox />
          <NavbarIcons />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
});

export default Navbar;

function NavbarIcons() {
  const { user, cart } = useContext(UserContext);
  const { showLoginModal } = useContext(LoginModalContext);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    if (!user) showLoginModal();
    else {
      // open dropdown Menu
      setAvatarAnchorEl(event.currentTarget);
    }
  };

  return (
    <Stack direction="row" sx={{ ml: 'auto' }}>
      {user && (
        <Button color="inherit" component={Link} to="/cart">
          <Badge badgeContent={cart.count} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </Button>
      )}
      <Button
        color="inherit"
        onClick={handleAvatarClick}
        id="avatar-button"
        aria-controls={avatarAnchorEl ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={avatarAnchorEl ? 'true' : undefined}
      >
        <Avatar sx={{ mr: 1 }} src={user?.photoURL} />
        {!user && 'Login'}
      </Button>
      <AvatarMenu {...{ avatarAnchorEl, setAvatarAnchorEl }} />
    </Stack>
  );
}

function AvatarMenu({ avatarAnchorEl, setAvatarAnchorEl }) {
  const navigate = useNavigate();
  const { showNotificationWith } = useContext(NotificationSnackbarContext);

  const closeAvatarMenu = () => setAvatarAnchorEl(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        closeAvatarMenu();
        navigate('/');
        showNotificationWith({
          message: 'Successfully logged out!',
          variant: 'success',
        });
      })
      .catch((err) => {
        showNotificationWith({
          message: err.message,
          variant: 'error',
        });
      });
  };

  return (
    <Menu
      open={!!avatarAnchorEl}
      onClose={closeAvatarMenu}
      anchorEl={avatarAnchorEl}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem
        onClick={() => {
          navigate('/account');
          closeAvatarMenu();
        }}
      >
        My Account
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate('/orders');
          closeAvatarMenu();
        }}
      >
        Orders
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
}

AvatarMenu.propTypes = {
  avatarAnchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  setAvatarAnchorEl: PropTypes.func.isRequired,
};

AvatarMenu.defaultProps = {
  avatarAnchorEl: null,
};
