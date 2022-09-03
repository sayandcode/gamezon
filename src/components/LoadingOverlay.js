import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

function LoadingOverlay({ open, onClose }) {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      onClick={onClose}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

LoadingOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LoadingOverlay;
