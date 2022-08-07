import { Autocomplete, TextField } from '@mui/material';
import PropTypes from 'prop-types';

function MuiAutocomplete({
  // Value and event handlers
  value,
  onChange: handleChange,
  onBlur,
  onFocus,
  // Html and form attributes
  id,
  name,
  label,
  required,
  error,
  helperText,
  placeholder,
  options,
  // Design Attributes
  disabled,
  fullWidth,
  size,
}) {
  return (
    <Autocomplete
      autoComplete
      autoHighlight
      // Value and event handlers
      {...{
        value,
        // give the new option to onChange, as the dom element will not store the options
        onChange: (event, option) => handleChange(option),
        onFocus,
        onBlur,
      }}
      // Html and form attributes
      {...{ id, name, options }}
      // Design attributes
      {...{ size, fullWidth, disabled }}
      renderInput={(params) => {
        return (
          <TextField
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...params}
            {...{ required, label, error, helperText, placeholder }}
            InputLabelProps={{
              shrink: true,
              variant: 'standard',
            }}
          />
        );
      }}
      isOptionEqualToValue={isOptionEqualToValue}
    />
  );
}

const optionPropType = PropTypes.oneOfType([
  PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  PropTypes.shape({ label: PropTypes.string }),
]);

MuiAutocomplete.propTypes = {
  // Value and event handlers
  value: optionPropType,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  // Html and form attributes
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(optionPropType).isRequired,
  // Design Attributes
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
};

MuiAutocomplete.defaultProps = {
  // Value and event handlers
  value: undefined,
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  // Html and form attributes
  id: undefined,
  name: undefined,
  label: undefined,
  required: false,
  error: false,
  helperText: '',
  placeholder: '',
  // Design Attributes
  disabled: false,
  fullWidth: false,
  size: 'medium',
};

// If the options are strings, then Mui handles it automatically.
// So there is no need for this 👇 function to be overloaded.
export function isOptionEqualToValue(option, value) {
  return option.label === value.label;
}

export default MuiAutocomplete;
