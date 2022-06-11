import React, { useContext, useState } from 'react';
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Button,
  darken,
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Toolbar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { PropTypes } from 'prop-types';
import Logo from './Logo';
import LoginModal from './LoginModal';
import { FirebaseContext } from '../utlis/Contexts/FirebaseContext';
import { auth } from '../utlis/firebase-config';

const Navbar = React.forwardRef((props, ref) => {
  return (
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
          <IconButton
            sx={{
              bgcolor: 'secondary.main',
              borderRadius: (theme) => {
                const r = `${theme.shape.borderRadius}px`;
                return `0 ${r} ${r} 0`;
              },
              py: 0.75, // thrice the padding of input element
              '&.Mui-focusVisible': {
                bgcolor: 'secondary.light',
              },
              '&:hover': {
                bgcolor: 'secondary.light',
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

function NavbarIcons() {
  const user = useContext(FirebaseContext);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [logoutSnackbarConfig, setLogoutSnackbarConfig] = useState({
    show: false,
  });

  const handleShoppingCartClick = () => {
    // route to shopping cart page
  };
  const handleAvatarClick = (event) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
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
      {showLoginModal && (
        <LoginModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      <AvatarMenu
        {...{ avatarAnchorEl, setAvatarAnchorEl, setLogoutSnackbarConfig }}
      />
      {!user && ( // logout snackbar is only applicable right after user signs out, so we unmount when signed in
        <LogoutSnackbar
          open={logoutSnackbarConfig.show}
          message={logoutSnackbarConfig.message}
          success={logoutSnackbarConfig.success}
          closeLogoutSnackbar={() =>
            setLogoutSnackbarConfig((oldConfig) => ({
              ...oldConfig,
              show: false,
            }))
          }
        />
      )}
    </Stack>
  );
}

function AvatarMenu({
  avatarAnchorEl,
  setAvatarAnchorEl,
  setLogoutSnackbarConfig,
}) {
  const navigate = useNavigate();
  const closeAvatarMenu = () => setAvatarAnchorEl(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        closeAvatarMenu();
        navigate('/');
        setLogoutSnackbarConfig({
          show: true,
          message: 'Successfully logged out!',
          success: true,
        });
      })
      .catch((err) => {
        setLogoutSnackbarConfig({
          show: true,
          message: err.message,
          success: false,
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
  setLogoutSnackbarConfig: PropTypes.func.isRequired,
};

AvatarMenu.defaultProps = {
  avatarAnchorEl: null,
};

function LogoutSnackbar({ open, closeLogoutSnackbar, message, success }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={closeLogoutSnackbar}>
      <Alert
        onClose={closeLogoutSnackbar}
        severity={success ? 'success' : 'error'}
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

LogoutSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  closeLogoutSnackbar: PropTypes.func.isRequired,
  message: PropTypes.node.isRequired,
  success: PropTypes.bool.isRequired,
};
