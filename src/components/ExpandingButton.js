import { Add as AddIcon } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';

function ExpandingButton({
  textContent,
  buttonIcon,
  size,
  expandDir,
  onClick,
}) {
  const uniqueID = useMemo(() => uuid(), []);
  const textVarName = `--${uniqueID}-expandingButton-text`;
  const widthVarName = `--${uniqueID}-expandingButton-width`;

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

        // need the extra specificity to counter the content: '' for ButtonBase styling
        '&&:after': {
          zIndex: 1,
          content: `var(${textVarName})`,
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
        '&:hover::after, &:focus::after, &.Mui-focusVisible::after': {
          px: 2,
          [expandDir === 'right' ? 'pl' : 'pr']: 5,
          width: `var(${widthVarName})`,
        },
      }}
      style={{
        // keep all the dynamic data as a css variable, to avoid creating unnecessary new
        // classes during program execution
        [textVarName]: `"${textContent}"`,
        [widthVarName]: `${textContent.length}ch`,
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
  textContent: PropTypes.string,
  buttonIcon: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  expandDir: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
};

ExpandingButton.defaultProps = {
  textContent: 'Add ', // add this space at the end cause ch doesn't exactly work
  buttonIcon: <AddIcon />,
  size: 'medium',
  expandDir: 'right',
  onClick: () => {},
};

export default ExpandingButton;
