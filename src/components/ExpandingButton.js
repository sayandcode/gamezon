import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, Button, IconButton } from '@mui/material';
import PropTypes from 'prop-types';

function ExpandingButton({
  clicked,
  unclickedText,
  clickedText,
  unclickedIcon,
  clickedIcon,
  size,
  expandDir,
  onClick,
}) {
  const textContent = clicked ? clickedText : unclickedText;
  const buttonIcon = clicked ? clickedIcon : unclickedIcon;

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
      onClick={onClick}
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
        {buttonIcon}
      </Box>
    </IconButton>
  );
}

ExpandingButton.propTypes = {
  clicked: PropTypes.bool,
  unclickedText: PropTypes.string,
  clickedText: PropTypes.string,
  unclickedIcon: PropTypes.node,
  clickedIcon: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  expandDir: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
};

ExpandingButton.defaultProps = {
  clicked: false,
  unclickedText: 'Add ', // add this space at the end cause ch doesn't exactly work
  clickedText: 'Remove ', // add this space at the end cause ch doesn't exactly work
  unclickedIcon: <AddIcon />,
  clickedIcon: <RemoveIcon />,
  size: 'medium',
  expandDir: 'right',
  onClick: () => {},
};

export default ExpandingButton;
