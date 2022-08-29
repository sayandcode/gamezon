import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import PropTypes from 'prop-types';

function DeliveryOptionsCheckboxes({
  formValues,
  options,
  handleCheckboxChange,
}) {
  return (
    <FormGroup sx={{ width: 'fit-content' }}>
      {Object.values(options).map((option) => (
        <FormControlLabel
          key={option.name}
          labelPlacement="start"
          label={option.label}
          control={<Checkbox />}
          name={option.name}
          id={option.name}
          checked={formValues[option.name]}
          onChange={handleCheckboxChange}
        />
      ))}
    </FormGroup>
  );
}

DeliveryOptionsCheckboxes.propTypes = {
  formValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.bool, PropTypes.object])
  ).isRequired,
  options: PropTypes.objectOf(
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
    })
  ).isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default DeliveryOptionsCheckboxes;
