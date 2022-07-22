import React, { useContext, useState } from 'react';
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Button,
  darken,
  Divider,
  InputAdornment,
  InputBase,
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
          <SearchBar />
          <NavbarIcons />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
});

export default Navbar;

function SearchBar() {
  return (
    <InputBase
      placeholder="Search for anything...(games,consoles, etc.)"
      sx={{
        bgcolor: 'primary.contrastText',
        borderRadius: 1,
        mx: 5,
        paddingLeft: 1,
        py: 0.25,
        width: '50%',
        '&.Mui-focused': {
          bgcolor: (theme) => darken(theme.palette.primary.contrastText, 0.1),
        },
      }}
      endAdornment={
        <InputAdornment position="end">
          <Button
            sx={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            color="secondary"
            variant="contained"
          >
            <SearchIcon sx={{ color: 'text.primary' }} />
          </Button>
        </InputAdornment>
      }
    />
  );
}

function NavbarIcons() {
  const { user } = useContext(UserContext);
  const { showLoginModal } = useContext(LoginModalContext);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

  const handleShoppingCartClick = () => {
    // route to shopping cart page
  };
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
        <Button color="inherit" onClick={handleShoppingCartClick}>
          <Badge badgeContent={1} color="secondary">
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
