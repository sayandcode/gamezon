import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import PropTypes from 'prop-types';
import Price from '../../../utlis/HelperClasses/Price';

// You may source this data from cloud, from some delivery database, if the need arises
const deliveryOptionsBooleans = {
  giftWrap: {
    label: 'I want to gift wrap my order (+$5.00)',
    name: 'giftWrap',
    price: new Price({ currency: '$', value: 5 }),
  },
  oneDayShipping: {
    label: 'I want my order in one day (+$10.00)',
    name: 'oneDayShipping',
    price: new Price({ currency: '$', value: 10 }),
  },
  businessHours: {
    label: 'Deliver only during business hours(10 a.m to 5 p.m)',
    name: 'businessHours',
    price: null,
  },
};

const defaultDeliveryOptions = {
  giftWrap: false,
  oneDayShipping: false,
  businessHours: false,
  address: null,
};

function DeliveryOptionsCheckboxes({ formValues, handleCheckboxChange }) {
  return (
    <FormGroup sx={{ width: 'fit-content' }}>
      {Object.values(deliveryOptionsBooleans).map((option) => (
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

const deliveryOptionsShape = Object.fromEntries(
  Object.keys(deliveryOptionsBooleans).map((key) => [key, PropTypes.bool])
);

DeliveryOptionsCheckboxes.propTypes = {
  formValues: PropTypes.shape(deliveryOptionsShape).isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default DeliveryOptionsCheckboxes;
export { defaultDeliveryOptions, deliveryOptionsBooleans };
