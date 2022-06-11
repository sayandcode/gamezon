import { Alert, Snackbar } from '@mui/material';
import { useContext } from 'react';
import { NotificationSnackbarContext } from '../utlis/Contexts/NotificationSnackbarContext';

export default function NotificationSnackbar() {
  const {
    notificationSnackbarConfig: { open, onClose, variant, message },
  } = useContext(NotificationSnackbarContext);

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <Alert onClose={onClose} severity={variant} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
