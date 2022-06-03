import React, { useState } from 'react';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Button,
  darken,
  IconButton,
  InputAdornment,
  InputBase,
  Stack,
  Toolbar,
} from '@mui/material';
import Logo from './Logo';

const Navbar = React.forwardRef((props, ref) => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.dark' }} ref={ref}>
      <Toolbar>
        <Logo
          variant="h3"
          component="a"
          href="/"
          sx={{ color: 'inherit', textDecoration: 'none' }}
        />
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
              bgcolor: (theme) =>
                darken(theme.palette.primary.contrastText, 0.1),
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
        <Stack direction="row" sx={{ ml: 'auto' }}>
          <Button color="inherit" onClick={() => setLoggedIn((old) => !old)}>
            {loggedIn ? (
              <ShoppingCartIcon />
            ) : (
              <>
                <Avatar sx={{ mr: 1 }} />
                Login
              </>
            )}
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
});

export default Navbar;
