import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';

export default function ContainedIconButton({ color, sx, onClick, children }) {
  return (
    <IconButton
      color={color}
      sx={{
        bgcolor: 'white',
        zIndex: 2,
        boxShadow: (theme) => theme.shadows[2],
        transform: 'translateY(-50%)',
        '&:hover, &:focus': {
          bgcolor: (theme) => theme.palette.grey[200],
          boxShadow: (theme) => theme.shadows[5],
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </IconButton>
  );
}

ContainedIconButton.propTypes = {
  color: PropTypes.oneOf([
    'inherit',
    'primary',
    'default',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
    undefined,
  ]),
  sx: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

ContainedIconButton.defaultProps = {
  color: 'default',
  sx: '',
  onClick: () => {},
};
