import { Box, Button } from '@mui/material';
import PropTypes from 'prop-types';

function ExpandingButton({ textContent, icon, size }) {
  return (
    <Button
      startIcon={icon}
      variant="contained"
      color="primary"
      className="ExpandingButton-root"
      size={size}
      sx={{
        '.MuiButton-startIcon': {
          m: 0,
          color: (theme) => theme.palette.primary.main,
          bgcolor: (theme) => theme.palette.primary.contrastText,
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          width: '32.5px', // set width same as height
          zIndex: 2,
        },
        px: 0,
        py: 0,
        minWidth: 'initial',
        borderRadius: (theme) => theme.shape.borderRadius,
        '.ExpandingButton-text': {
          zIndex: 1,
          width: 0,
          overflow: 'hidden',
          transitionProperty: 'width, padding-inline',
          transitionDuration: '1s',
        },
        '&:hover .ExpandingButton-text': {
          width: (theme) =>
            `calc(${textContent.length}ch + ${theme.spacing(3 * 1)})`,
        },
      }}
    >
      <Box
        className="ExpandingButton-text"
        sx={{
          whiteSpace: 'nowrap',
          py: 0.5,
        }}
      >
        {textContent}
      </Box>
    </Button>
  );
}

ExpandingButton.propTypes = {
  textContent: PropTypes.string,
  icon: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

ExpandingButton.defaultProps = {
  textContent: '',
  size: 'medium',
};

export default ExpandingButton;
