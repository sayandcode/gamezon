import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';

function ErrorMessage() {
  return (
    <Stack alignItems="center">
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        variant="h6"
        color="error"
      >
        <ErrorOutlineIcon sx={{ mr: 1 }} />
        Oops! Something went wrong...
      </Typography>
      <Typography variant="subtitle2" color="error">
        Refresh the page and try again
      </Typography>
    </Stack>
  );
}

export default ErrorMessage;
