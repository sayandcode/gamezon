import { Box, Button, IconButton } from '@mui/material';
import PropTypes from 'prop-types';

function ExpandingButton({ textContent, icon, size, expandDir }) {
  return (
    <IconButton
      className="ExpandingButton-root"
      color="secondary"
      size={size}
      sx={{
        p: 0,

        position: 'relative',
        '&:hover, &:focus': {
          zIndex: 3,
        },

        '&:after': {
          zIndex: 1,
          content: `"${textContent}"`,
          whiteSpace: 'nowrap',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',

          position: 'absolute',
          [expandDir === 'right' ? 'left' : 'right']: 0,
          height: '100%',
          display: 'flex',
          alignItems: 'center',

          borderRadius: (theme) => theme.shape.borderRadius,

          width: '100%', // takes shape of iconButton
          overflow: 'hidden',
          transitionPropery: 'width, padding',
          transitionDuration: (theme) =>
            `${theme.transitions.duration.complex}ms`,
          transitionTimingFunction: (theme) =>
            `${theme.transitions.easing.easeInOut}`,
          boxSizing: 'content-box',
        },
        '&:hover::after, &:focus::after': {
          px: 2,
          [expandDir === 'right' ? 'pl' : 'pr']: 5,
          width: `${textContent.length}ch`,
        },
      }}
    >
      <Box
        className="ExpandingButton-icon"
        sx={{
          zIndex: 2,
          bgcolor: 'white',
          color: 'primary.main',
          borderRadius: '50%',
          aspectRatio: '1',

          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 0.5,
        }}
      >
        {icon}
      </Box>
    </IconButton>
  );
}

ExpandingButton.propTypes = {
  textContent: PropTypes.string,
  icon: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  expandDir: PropTypes.oneOf(['left', 'right']),
};

ExpandingButton.defaultProps = {
  textContent: '',
  size: 'medium',
  expandDir: 'right',
};

export default ExpandingButton;
