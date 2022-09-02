import { Search as SearchIcon } from '@mui/icons-material';
import { Button, darken, InputAdornment, InputBase } from '@mui/material';
import { forwardRef } from 'react';

const RenderInputForSearchBox = forwardRef((props, ref) => {
  return (
    <InputBase
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      placeholder="Search for anything...(games,consoles, etc.)"
      sx={{
        bgcolor: 'primary.contrastText',
        borderRadius: 1,
        mx: 5,
        paddingLeft: 1,
        py: 0.25,
        width: '100%',
        '&.Mui-focused': {
          bgcolor: (theme) => darken(theme.palette.primary.contrastText, 0.1),
        },
      }}
      /* this button doesn't do anything right now, and is more of a ux affordance */
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
});

export default RenderInputForSearchBox;
