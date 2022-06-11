import { Box, InputAdornment, styled, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Input, { getCountries } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';
import PropTypes from 'prop-types';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';

// Since this uses the react-phone-number-input component from npm,
// the handling of the value is done inside that component, and we
// merely get an onChange handler that calls the function for us.
// It is not really a 100% controlled component. But the values are
// always accessible to us via state, so no harm done
// We mirror this behaviour in our MuiPhoneNumbeInput Component
function MuiPhoneNumberInput({
  required,
  helperText,
  error,
  onChange,
  sx: wrapperComponentSx,
}) {
  const [country, setCountry] = useState();
  const inputRef = useRef();
  const SelectRef = useRef();

  // makes sure the components are updated with the height from the ref
  // by triggering an additional render
  const [firstMount, setFirstMount] = useState(true);

  useEffect(() => setFirstMount(false), []);

  return (
    <Box sx={{ display: 'inline-block', ...wrapperComponentSx }}>
      <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <CountrySelect
          labels={en}
          value={country}
          title="Select your country"
          onChange={setCountry}
          style={{
            position: 'absolute',
            left: '1px',
            top: 0,
            transform: 'translateY(+40.5%)',
            height: firstMount ? 'auto' : inputRef.current.offsetHeight * 0.95,
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
          helperText={helperText}
          error={error}
          inputProps={{
            type: 'tel',
            ref: inputRef,
            style: {
              paddingLeft: firstMount
                ? 'auto'
                : `${SelectRef.current.offsetWidth}px`,
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
          // value={inputValue}
          onChange={(newVal) => {
            onChange(newVal);
          }}
        />
      </Box>
    </Box>
  );
}

MuiPhoneNumberInput.propTypes = {
  required: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
};
MuiPhoneNumberInput.defaultProps = {
  sx: {},
  required: false,
  helperText: '',
  error: false,
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
