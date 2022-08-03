import PhoneInput from 'react-phone-number-input';
import {
  alpha,
  Box,
  FormHelperText,
  InputBase,
  InputLabel,
  NativeSelect,
  Stack,
} from '@mui/material';
import { forwardRef, useCallback } from 'react';
import getUnicodeFlagIcon from 'country-flag-icons/unicode';
import PropTypes from 'prop-types';
import MuiOutlinedInput from './MuiOutlinedInput';

// Since this uses the react-phone-number-input component from npm,
// the handling of the value is done inside that component, and we
// merely get an onChange handler that calls the function for us.
// It is not really a 100% controlled component, as the absence of an
// onChange handler will not stop the dom element from being updated.
// But the values are always accessible to us via state, so no harm done
// We mirror this behaviour in our MuiPhoneNumberInput Component, which is a wrapper.
const TextFieldWithProps = forwardRef(
  (
    {
      // change handlers
      value,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      // html attributes and form helpers
      name,
      id,
      label,
      required,
      type,
      autoComplete,
      className,
      disabled,
      readOnly,
      error,
      // design
      fullWidth,
      size,
    },
    ref
  ) => {
    return (
      <MuiOutlinedInput
        {...{
          // change handlers
          value,
          onChange,
          onBlur,
          onFocus,
          onKeyDown,
          // html attributes and form helpers
          name,
          id,
          label,
          required,
          type,
          className,
          autoComplete,
          disabled,
          readOnly,
          error,
          // design
          fullWidth,
          size,
        }}
        sx={{ mb: 0, pl: 6 }}
        inputRef={ref}
      />
    );
  }
);

TextFieldWithProps.propTypes = {
  // change handlers
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,

  // html attributes and form helpers
  name: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  autoComplete: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  error: PropTypes.bool,

  // design
  size: PropTypes.string,
  fullWidth: PropTypes.bool,
};

TextFieldWithProps.defaultProps = {
  // change handlers
  value: '',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  onKeyDown: () => {},

  // html attributes and form helpers
  name: undefined,
  id: undefined,
  label: '',
  required: false,
  disabled: false,
  readOnly: false,
  error: false,

  // design
  fullWidth: false,
  size: 'medium',
};

function CountrySelect({
  // props added by user
  size,
  error,
  // props added by react-phone-number-input
  value = 'ZZ',
  name,
  options,
  onChange,
  onBlur,
  onFocus,
  readOnly,
  disabled,
  'aria-label': ariaLabel,
}) {
  const handleChange = useCallback(
    (event) => {
      const untreatedVal = event.target.value;
      // on change of the react-phone-number-input country select accepts undefined instead of 'ZZ' for international.
      const treatedVal = untreatedVal === 'ZZ' ? undefined : untreatedVal;
      onChange(treatedVal);
    },
    [onChange]
  );

  const outlinePalette = error ? 'error' : 'primary';
  return (
    <NativeSelect
      value={value}
      onChange={handleChange}
      {...{ name, disabled, onBlur, onFocus, readOnly }}
      aria-label={ariaLabel}
      variant="standard"
      sx={{
        position: 'absolute',
        top: '2px',
        left: '2px',
        zIndex: 2,
        width: '4.5ch',
        height: size === 'small' ? '90%' : '93%',
        pl: 1,
        pr: 5,
        bgcolor: 'grey.200',
        outline: '2px solid',
        outlineColor: (theme) => alpha(theme.palette[outlinePalette].main, 0.5),
        '&:focus-within, &:hover': {
          bgcolor: 'grey.400',
          outlineColor: (theme) =>
            alpha(theme.palette[outlinePalette].main, 0.75),
        },

        borderTopLeftRadius: (theme) => theme.shape.borderRadius,
        borderBottomLeftRadius: (theme) => theme.shape.borderRadius,
      }}
      input={<InputBase />}
    >
      {options.map(({ value: optionVal = 'ZZ', label }) => (
        <option key={optionVal} value={optionVal}>
          {getUnicodeFlagIcon(optionVal)} {label}
        </option>
      ))}
    </NativeSelect>
  );
}

CountrySelect.propTypes = {
  // props added by user
  size: PropTypes.oneOf(['small', 'medium']).isRequired,
  error: PropTypes.bool.isRequired,
  // props added by react-phone-number-input
  value: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  'aria-label': PropTypes.string.isRequired,
};

CountrySelect.defaultProps = {
  value: undefined,
  name: undefined,
  readOnly: false,
  disabled: false,
};

export default function MuiPhoneNumberInput({
  value,
  // change handlers
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  // html attributes and form helpers
  name,
  id,
  label,
  required,
  helperText,
  error,
  // design
  fullWidth,
  size,
  sx,
}) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        ...(fullWidth && { width: '100%' }),
        mb: 2,
        ...sx,
      }}
    >
      <Stack
        className="MuiPhoneNumberInput-root"
        sx={{
          display: 'inline-flex',
          ...(fullWidth && { width: '100%' }),
        }}
      >
        <InputLabel
          htmlFor={id}
          shrink
          sx={{ position: 'absolute' }}
          {...{ error, required }}
        >
          {label}
        </InputLabel>
        <Box sx={{ ...(label && { mt: 2.5 }) }}>
          <PhoneInput
            // change handlers
            {...{
              value,
              /* a default value of '' prevents isPossiblePhoneNumber from failing */
              onChange: (newVal) => onChange(newVal || ''),
              onBlur,
              onFocus,
              onKeyDown,
            }}
            // html attributes and form helpers
            {...{ name, id, value, required }}
            international
            inputComponent={TextFieldWithProps}
            numberInputProps={{ error, fullWidth, size }}
            countrySelectComponent={CountrySelect}
            countrySelectProps={{ size, error }}
            style={{ position: 'relative' }}
            // ^^ is styles applied to wrapper component.
            // The countrySelectComponent uses this position:'relative' to size itself against the wrapper,
            // which is sized according to statically positioned inputComponent
          />
        </Box>
        <FormHelperText
          variant="outlined"
          sx={{ mt: '4px', overflowX: 'auto' }}
          error={error}
        >
          {helperText}
        </FormHelperText>
      </Stack>
    </Box>
  );
}

MuiPhoneNumberInput.propTypes = {
  // change handlers
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,

  // html attributes and form helpers
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,

  // design
  fullWidth: PropTypes.bool,
  size: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.object,
};

MuiPhoneNumberInput.defaultProps = {
  // change handlers
  value: '',
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  onKeyDown: () => {},

  // html attributes and form helpers
  id: undefined,
  name: undefined,
  label: undefined,
  required: false,
  helperText: '',
  error: false,

  // design
  fullWidth: false,
  size: 'medium',
  sx: {},
};
