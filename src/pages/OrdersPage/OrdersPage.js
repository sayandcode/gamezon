import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { Suspense, useContext, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorMessage from '../../components/ErrorMessage';
import { UserContext } from '../../utlis/Contexts/UserData/UserContext';
import useDataHandler from '../../utlis/CustomHooks/useDataHandler';
import { useResource } from '../../utlis/SuspenseHelpers';
import OrdersPageDataHandler from './Helpers/OrdersPageDataHandler';
import OrdersList, { OrdersListFallback } from './Subcomponents/OrdersList';

const MAX_ORDERS_PER_PAGE = 5;

function OrdersPage() {
  /* CONTEXTS */
  const { user } = useContext(UserContext);

  /* HANDLER */
  const userID = user.uid;
  const dataHandler = useDataHandler(
    new OrdersPageDataHandler({
      userID,
      ordersPerPage: MAX_ORDERS_PER_PAGE,
    })
  );

  /* COMPONENT STATE */
  const [pageNo, setPageNo] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  /* RESOURCE */
  const ordersDataResource = useResource(getOrdersData, [pageNo]);

  useEffect(updateButtonStatus, [ordersDataResource]);

  /* FUNCTION DEFINITIONS */
  async function getOrdersData() {
    return dataHandler.getOrdersData(pageNo);
  }

  function updateButtonStatus() {
    setIsButtonDisabled(true);
    ordersDataResource.promise.then(() => setIsButtonDisabled(false));
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
          Orders
        </Typography>
        <ErrorBoundary
          fallback={
            <Stack py={2} alignItems="center">
              <ErrorMessage />
            </Stack>
          }
        >
          <Suspense
            fallback={<OrdersListFallback count={MAX_ORDERS_PER_PAGE} />}
          >
            <OrdersList ordersDataResource={ordersDataResource} />
          </Suspense>
        </ErrorBoundary>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" gap={2} justifyContent="center">
          <Button
            onClick={() => setPageNo((old) => old - 1)}
            disabled={isButtonDisabled}
            sx={{
              visibility: pageNo !== 1 ? 'visible' : 'hidden',
            }}
          >
            Newer
          </Button>
          <Button
            onClick={() => setPageNo((old) => old + 1)}
            disabled={isButtonDisabled}
            sx={{
              visibility:
                pageNo === dataHandler.lastPage ? 'hidden' : 'visible',
            }}
          >
            Older
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default OrdersPage;
export { MAX_ORDERS_PER_PAGE };
