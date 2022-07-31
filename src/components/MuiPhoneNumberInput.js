import { Box, InputAdornment, styled, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Input, { getCountries } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';
import PropTypes from 'prop-types';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

// Since this uses the react-phone-number-input component from npm,
// the handling of the value is done inside that component, and we
// merely get an onChange handler that calls the function for us.
// It is not really a 100% controlled component, as the absence of an
// onChange handler will not stop the dom element from being updated.
// But the values are always accessible to us via state, so no harm done
// We mirror this behaviour in our MuiPhoneNumberInput Component, which is a wrapper.
function MuiPhoneNumberInput({
  required,
  helperText,
  error,
  value,
  onChange,
  fullWidth,
  size,
  sx: wrapperComponentSx,
}) {
  /* COUNTRY-SELECT STATE */
  const [country, setCountry] = useState();

  /* REFS */
  const inputRef = useRef();
  const SelectRef = useRef();
  const rootRef = useRef();

  /* DYNAMIC ATTRIBUTES */
  const [dynamicAttributes, setDynamicAttributes] = useState({
    select: {
      top: 0,
      height: 'auto',
    },
    input: {
      paddingLeft: 'auto',
    },
  });
  // makes sure the components are updated with the height from the refs
  // after the first render
  useEffect(updateDynamicAttributes, []);

  function updateDynamicAttributes() {
    const inputY = inputRef.current.getBoundingClientRect().top;
    const inputHeight = inputRef.current.offsetHeight;
    const rootY = rootRef.current.getBoundingClientRect().top;
    const inputBorder = 1; // px. Eyeballing it

    const select = {
      top: `${inputY - rootY + inputBorder}px`,
      height: `${inputHeight * 0.95}px`,
    };
    const input = {
      paddingLeft: `${SelectRef.current.offsetWidth}px`,
    };
    setDynamicAttributes({ select, input });
  }

  return (
    <Box
      sx={{
        display: 'inline-block',
        ...(fullWidth && { width: '100%' }),
        ...wrapperComponentSx,
      }}
    >
      <Box
        sx={{
          ...(fullWidth && { width: '100%' }),
          position: 'relative',
          display: 'inline-block',
        }}
        ref={rootRef}
      >
        <CountrySelect
          labels={en}
          value={country}
          title="Select your country"
          onChange={setCountry}
          style={{
            position: 'absolute',
            top: dynamicAttributes.select.top,
            left: '1px',
            height: dynamicAttributes.select.height,
            width: '3.5ch',
            fontSize: '2rem',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'red',
            },
          }}
          ref={SelectRef}
        />
        <TextField
          required={required}
          label="Phone Number"
          size={size}
          fullWidth={fullWidth}
          helperText={helperText}
          error={error}
          inputProps={{
            type: 'tel',
            ref: inputRef,
            style: {
              paddingLeft: dynamicAttributes.input.paddingLeft,
            },
            international: true,
            withCountryCallingCode: true,
            country,
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={{
            inputComponent: Input,
            startAdornment: <InputAdornment position="start" />,
          }}
          value={value}
          onChange={(newVal = '') => onChange(newVal)}
        />
      </Box>
    </Box>
  );
}

MuiPhoneNumberInput.propTypes = {
  required: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  sx: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  ),
};
MuiPhoneNumberInput.defaultProps = {
  sx: {},
  required: false,
  helperText: '',
  error: false,
  value: '',
  onChange: () => {},
  fullWidth: false,
  size: 'medium',
};

export default MuiPhoneNumberInput;

const StyledSelect = styled('select')(({ theme }) => ({
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CountrySelect = React.forwardRef(
  ({ value, onChange, labels, ...rest }, ref) => {
    return (
      <StyledSelect
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        value={value}
        onChange={(event) => onChange(event.target.value || undefined)}
        ref={ref}
      >
        <optgroup style={{ fontSize: '1rem' }}>
          <option value="">{`${getUnicodeFlagIcon('ZZ')} ${labels.ZZ}`}</option>
          {getCountries().map((country) => (
            <option key={country} value={country}>
              {`${getUnicodeFlagIcon(country)} ${labels[country]}`}
            </option>
          ))}
        </optgroup>
      </StyledSelect>
    );
  }
);

CountrySelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  labels: PropTypes.objectOf(PropTypes.string).isRequired,
};

CountrySelect.defaultProps = {
  value: '',
};
