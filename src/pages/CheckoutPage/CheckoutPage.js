import { Divider, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorMessage from '../../components/ErrorMessage';
import { Cart } from '../../utlis/Contexts/UserData/UserDataHelperClasses';
import { promiseToResource } from '../../utlis/SuspenseHelpers';
import { CheckoutDataHandler } from './CheckoutPageHelpers';
import DeliveryForm from './DeliveryForm';

function CheckoutPage() {
  const { state: reactRouterState } = useLocation();
  // Prevent direct access of the checkout URL
  if (!reactRouterState) return <Navigate to="/" />;

  // serializing and deserializing is necessary because of the nature of navigate-state/useLocation
  const cart = new Cart(reactRouterState.serializedCart);

  /* CHECKOUT DATA RESOURCE */
  const [checkoutDataResource, setCheckoutDataResource] = useState(
    promiseToResource(new Promise(() => {}))
  );
  useEffect(fetchCartDataResource, []);

  /* FUNCTION DEFINITIONS */
  function fetchCartDataResource() {
    const newResource = promiseToResource(getCheckoutData(cart));
    setCheckoutDataResource(newResource);
  }

  async function getCheckoutData(_cart) {
    const cartItems = Object.values(_cart.contents);
    return CheckoutDataHandler.prepareFor(cartItems);
  }

  return (
    <Stack m={2} spacing={2}>
      <Paper sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="text.primary"
          display="inline-block"
          gutterBottom
        >
          Checkout
        </Typography>
        <ErrorBoundary
          fallback={
            <Stack>
              <ErrorMessage />
            </Stack>
          }
        >
          <Suspense fallback={<CheckoutItemsListFallback cart={cart} />}>
            <CheckoutList checkoutDataResource={checkoutDataResource} />
          </Suspense>
        </ErrorBoundary>
        <DeliveryForm cart={cart} />
      </Paper>
    </Stack>
  );
}

function CheckoutList({ checkoutDataResource }) {
  const checkoutData = checkoutDataResource.read();

  return (
    <Stack
      sx={{
        bgcolor: 'grey.100',
        mx: '20%',
        mb: 2,
      }}
      divider={<Divider />}
    >
      {checkoutData.items.map((item) => (
        <Stack
          direction="row"
          py={0.5}
          px={1}
          alignItems="baseline"
          key={item.productID}
        >
          <Typography variant="body1">
            {item.name} ({item.variant})
          </Typography>
          <Typography variant="subtitle2" whiteSpace="pre">
            {' '}
            x {item.count}nos
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold" ml="auto">
            {item.price.currency}
            {item.price.value}
          </Typography>
        </Stack>
      ))}
      <Stack direction="row" py={0.5} px={1} alignItems="baseline">
        <Typography
          variant="body1"
          textTransform="uppercase"
          fontWeight="bold"
          sx={{
            width: '100%',
            textAlign: 'center',
          }}
        >
          Total
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {checkoutData.cartTotalPrice.currency}
          {checkoutData.cartTotalPrice.value}
        </Typography>
      </Stack>
    </Stack>
  );
}

CheckoutList.propTypes = {
  checkoutDataResource: PropTypes.shape({ read: PropTypes.func }).isRequired,
};

function CheckoutItemsListFallback({ cart }) {
  return (
    <Skeleton sx={{ mx: '20%', maxWidth: 'initial' }}>
      <Stack>
        {Object.values(cart.contents).map((item) => (
          <Stack direction="row" py={0.5} key={item.productID}>
            <Typography variant="body1">{item.name}</Typography>
          </Stack>
        ))}
        <Stack direction="row" py={0.5} key="total">
          <Typography variant="body1">Total</Typography>
        </Stack>
      </Stack>
    </Skeleton>
  );
}

CheckoutItemsListFallback.propTypes = {
  cart: PropTypes.instanceOf(Cart).isRequired,
};

export default CheckoutPage;
