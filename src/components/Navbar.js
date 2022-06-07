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
  IconButton,
  InputAdornment,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import LoginModal from './LoginModal';
import { FirebaseContext } from '../utlis/FirebaseContext';

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
  const navigate = useNavigate();
  const user = /* useContext(FirebaseContext) */ false;
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);

  const handleShoppingCartClick = () => {
    // route to shopping cart page
  };
  const handleAvatarClick = (event) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      // implement menu logic
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
        <Avatar sx={{ mr: 1 }} />
        {!user && 'Login'}
      </Button>
      {showLoginModal && (
        <LoginModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
      <Menu
        open={!!avatarAnchorEl}
        onClose={() => setAvatarAnchorEl(null)}
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
        <MenuItem onClick={() => navigate('/account')}>My Account</MenuItem>
        <MenuItem onClick={() => navigate('/orders')}>Orders</MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Stack>
  );
}
