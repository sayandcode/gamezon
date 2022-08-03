import { alpha } from '@mui/material';

export default {
  '&::-webkit-scrollbar': {
    width: '1em',
  },

  '&::-webkit-scrollbar-track': {
    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
  },

  '&::-webkit-scrollbar-thumb': {
    bgcolor: (theme) => theme.palette.primary.light,
    borderRadius: (theme) => theme.shape.borderRadius,
    outline: (theme) => `1px solid ${theme.palette.grey[600]}`,
    '&:hover': {
      bgcolor: (theme) => theme.palette.primary.main,
    },
  },
};
