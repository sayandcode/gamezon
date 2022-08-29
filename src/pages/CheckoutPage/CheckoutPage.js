import { Paper, Stack, Typography } from '@mui/material';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, useLocation } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import Cart from '../../utlis/Contexts/UserData/UserDataHelperClasses/Cart';
import { useResource } from '../../utlis/SuspenseHelpers';
import DeliveryForm, {
  DeliveryFormFallback,
} from './Subcomponents/DeliveryForm';
import CheckoutList, {
  CheckoutItemsListFallback,
} from './Subcomponents/CheckoutList';
import CheckoutPageDataHandler from './Helpers/CheckoutPageDataHandler';
import useDataHandler from '../../utlis/CustomHooks/useDataHandler';

function CheckoutPage() {
  const { state: reactRouterState } = useLocation();
  // Prevent direct access of the checkout URL
  if (!reactRouterState) return <Navigate to="/" />;

  // serializing and deserializing is necessary because of the nature of navigate-state/useLocation
  const cart = new Cart(reactRouterState.serializedCart);

  /* COMPONENT DATA HANDLER */
  const dataHandler = useDataHandler(CheckoutPageDataHandler);

  /* RESOURCES */
  const checkoutItemsDataResource = useResource(getCheckoutItemsData, []);
  const ordersMetadataResource = useResource(getOrdersMetadata, []);

  /* FUNCTION DEFINITIONS */
  async function getCheckoutItemsData() {
    return dataHandler.getCheckoutItemsData(cart);
  }

  async function getOrdersMetadata() {
    return dataHandler.getOrdersMetadata();
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
            <CheckoutList
              checkoutItemsDataResource={checkoutItemsDataResource}
            />
          </Suspense>
          <Suspense fallback={<DeliveryFormFallback />}>
            <DeliveryForm
              cart={cart}
              ordersMetadataResource={ordersMetadataResource}
              checkoutItemsDataResource={checkoutItemsDataResource}
            />
          </Suspense>
        </ErrorBoundary>
      </Paper>
    </Stack>
  );
}

export default CheckoutPage;
