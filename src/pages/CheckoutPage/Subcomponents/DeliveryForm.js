import { Check, Error as ErrorIcon } from '@mui/icons-material';
import { Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useContext, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressSelector from '../../../components/Address/AddressSelector';
import { NotificationSnackbarContext } from '../../../utlis/Contexts/NotificationSnackbarContext';
import { UserContext } from '../../../utlis/Contexts/UserData/UserContext';
import Cart from '../../../utlis/Contexts/UserData/UserDataHelperClasses/Cart';
import useDataHandler from '../../../utlis/CustomHooks/useDataHandler';
import Order from '../../../utlis/HelperClasses/OrderClass';
import sleep from '../../../utlis/sleep';
import { resourcePropType } from '../../../utlis/SuspenseHelpers';
import DeliveryFormDataHandler from '../Helpers/DeliveryFormDataHandler';
import DeliveryOptionsCheckboxes from './DeliveryOptionsCheckboxes';

function DeliveryForm({
  cart,
  ordersMetadataResource,
  checkoutItemsDataResource,
}) {
  /* READ RESOURCES */
  const checkoutItemsData = checkoutItemsDataResource.read();
  const ordersMetadata = ordersMetadataResource.read();

  /* MAKE HANDLERS */
  const dataHandler = useDataHandler(
    new DeliveryFormDataHandler(checkoutItemsData, ordersMetadata)
  );

  const [formValues, setInForm] = useReducer(
    formUpdateReducer,
    dataHandler.initialFormValues
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

  const { user } = useContext(UserContext);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    // A valid address is the only validation needed at this point
    if (!formValues.address) {
      setErrorChecking(true);
      return;
    }

    /* Prepare the order */
    setIsFormSubmitting(true);
    const { address, ...deliveryOptions } = formValues;
    const order = new Order({
      orderItems: cart,
      address,
      deliveryOptions,
    });

    /* And confirm it */
    order.confirmFor(user).then(formSuccessPath).catch(formFailPath);
  };

  /* FORM SUBMIT SUCCESS AND FAILURE PATHS */
  const navigate = useNavigate();
  const { showNotificationWith } = useContext(NotificationSnackbarContext);
  async function formSuccessPath() {
    showNotificationWith({
      message: 'Order Placed!',
      variant: 'success',
    });
    await sleep(2000);
    navigate('/orders');
  }
  function formFailPath() {
    showNotificationWith({
      message: 'Something went wrong. Try again..',
      variant: 'error',
    });
    setIsFormSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" ml={3} component="h2">
        Choose delivery Address
      </Typography>
      <Box width="95%" mt={1} mx="auto">
        <AddressSelector name="address" onSelect={handleChange} />
      </Box>
      <Stack
        direction="row"
        sx={{
          width: '95%',
          mx: 'auto',
          my: 2,
          gap: '5%',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <DeliveryOptionsCheckboxes
          formValues={formValues}
          options={dataHandler.allDeliveryOptions}
          handleCheckboxChange={handleCheckboxChange}
        />
        <Typography variant="h4" fontWeight="bold">
          Order Total:&nbsp;
          {dataHandler.orderTotalPrice(formValues).print()}
        </Typography>
      </Stack>
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
          disabled={isFormSubmitting}
        >
          Confirm Order
        </Button>
      </Box>
    </form>
  );
}

DeliveryForm.propTypes = {
  cart: PropTypes.instanceOf(Cart).isRequired,
  ordersMetadataResource: resourcePropType.isRequired,
  checkoutItemsDataResource: resourcePropType.isRequired,
};

function formUpdateReducer(oldValues, newValues) {
  return { ...oldValues, ...newValues };
}

function DeliveryFormFallback() {
  return (
    <div>
      <Typography variant="h6" ml={3} component="h2">
        Choose delivery Address
      </Typography>
      <Box width="95%" mt={1} mx="auto">
        <AddressSelector />
      </Box>
      <Stack
        direction="row"
        sx={{
          width: '95%',
          mx: 'auto',
          my: 2,
          gap: '5%',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Skeleton sx={{ height: '100px', width: '100%' }} />
        <Typography variant="h4" fontWeight="bold" whiteSpace="nowrap">
          Order Total:
          <Skeleton sx={{ display: 'inline-block', width: '100px' }} />
        </Typography>
      </Stack>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          type="submit"
          color="secondary"
          size="large"
          variant="contained"
          endIcon={<Check />}
          disabled
        >
          Confirm Order
        </Button>
      </Box>
    </div>
  );
}

export default DeliveryForm;
export { DeliveryFormFallback };
