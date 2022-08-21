import { Paper, Stack, Typography } from '@mui/material';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, useLocation } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import Cart from '../../utlis/Contexts/UserData/UserDataHelperClasses/Cart';
import { useResource } from '../../utlis/SuspenseHelpers';
import { CheckoutDataHandler } from './CheckoutPageHelpers';
import DeliveryForm from './DeliveryForm';
import CheckoutList, { CheckoutItemsListFallback } from './CheckoutList';

function CheckoutPage() {
  const { state: reactRouterState } = useLocation();
  // Prevent direct access of the checkout URL
  if (!reactRouterState) return <Navigate to="/" />;

  // serializing and deserializing is necessary because of the nature of navigate-state/useLocation
  const cart = new Cart(reactRouterState.serializedCart);

  /* CHECKOUT DATA RESOURCE */
  const checkoutDataResource = useResource(getCheckoutData, []);

  /* FUNCTION DEFINITIONS */
  async function getCheckoutData() {
    const cartItems = Object.values(cart.contents);
    return CheckoutDataHandler.createFor(cartItems);
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
        <DeliveryForm cart={cart} checkoutDataResource={checkoutDataResource} />
      </Paper>
    </Stack>
  );
}

export default CheckoutPage;
