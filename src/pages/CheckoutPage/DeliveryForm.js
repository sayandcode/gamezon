import { Check, Error as ErrorIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useReducer, useState } from 'react';
import AddressSelector from '../../components/Address/AddressSelector';
import { Cart } from '../../utlis/Contexts/UserData/UserDataHelperClasses';
import {
  confirmOrder,
  defaultDeliveryOptions as initialFormValues,
} from './CheckoutPageHelpers';

function DeliveryForm({ cart }) {
  const [formValues, setInForm] = useReducer(
    formUpdateReducer,
    initialFormValues
  );

  const [errorChecking, setErrorChecking] = useState(false);

  const handleCheckboxChange = (event) => {
    const { name } = event.target;
    const newVal = event.target.checked;
    setInForm({ [name]: newVal });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInForm({ [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // A valid address is the only validation needed at this point
    if (!formValues.address) {
      setErrorChecking(true);
      return;
    }
    confirmOrder(cart, formValues);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" ml={3} component="h2">
        Choose delivery Address
      </Typography>
      <Box width="95%" mt={1} mx="auto">
        <AddressSelector name="address" onSelect={handleChange} />
      </Box>
      <FormGroup sx={{ width: 'fit-content', marginInline: 'auto 10%', my: 2 }}>
        <DeliveryOptionCheckbox
          name="oneDayShipping"
          id="oneDayShipping"
          checked={formValues.oneDayShipping}
          onChange={handleCheckboxChange}
        >
          I want my order in one day (+$5.00)
        </DeliveryOptionCheckbox>
        <DeliveryOptionCheckbox
          name="giftWrap"
          id="giftWrap"
          checked={formValues.giftWrap}
          onChange={handleCheckboxChange}
        >
          I want to gift wrap my order
        </DeliveryOptionCheckbox>
      </FormGroup>
      <Box sx={{ textAlign: 'center' }}>
        {errorChecking && !formValues.address && (
          <Typography color="error" sx={{ verticalAlign: 'middle', mb: 1 }}>
            <ErrorIcon sx={{ verticalAlign: 'bottom' }} />
            Please select a valid Address
          </Typography>
        )}
        <Button
          type="submit"
          color="secondary"
          size="large"
          variant="contained"
          endIcon={<Check />}
        >
          Confirm Order
        </Button>
      </Box>
    </form>
  );
}

DeliveryForm.propTypes = {
  cart: PropTypes.instanceOf(Cart).isRequired,
};

function formUpdateReducer(oldValues, newValues) {
  return { ...oldValues, ...newValues };
}

function DeliveryOptionCheckbox({ children, name, id, checked, onChange }) {
  return (
    <FormControlLabel
      labelPlacement="start"
      label={children}
      control={<Checkbox />}
      {...{ name, id, checked, onChange }}
    />
  );
}

DeliveryOptionCheckbox.propTypes = {
  children: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

DeliveryOptionCheckbox.defaultProps = {
  checked: undefined,
  onChange: undefined,
};

export default DeliveryForm;
