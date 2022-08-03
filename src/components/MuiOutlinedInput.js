import { alpha, OutlinedInput } from '@mui/material';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const MuiOutlinedInput = forwardRef(({ sx, label, ...rest }, ref) => {
  return (
    <OutlinedInput
      // Let MUI handle the errors, this is just a wrapper.
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      sx={{
        backgroundColor: 'white',
        ...(label && { mt: 2.5 }),
        fieldset: {
          legend: {
            // this does what notched:false does, but permanently,
            // and cannot be overriden by mentioning InputProps
            width: 0,
          },
        },
        '&&.Mui-focused': {
          fieldset: {
            // outline: '2px solid red',
            border: '2px solid',
            borderColor: (theme) => alpha(theme.palette.primary.light, 0.75),
            boxShadow: (theme) =>
              `${alpha(theme.palette.primary.light, 0.25)} 0 0 2px 2px`,
          },
        },
        '&&.Mui-error': {
          fieldset: {
            border: '2px solid',
            borderColor: (theme) => alpha(theme.palette.error.main, 0.75),
            boxShadow: (theme) =>
              `${alpha(theme.palette.error.main, 0.25)} 0 0 2px 2px`,
          },
        },
        ...sx,
      }}
      ref={ref}
    />
  );
});

export default MuiOutlinedInput;

MuiOutlinedInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
  label: PropTypes.string,
};

MuiOutlinedInput.defaultProps = {
  sx: {},
  label: '',
};
