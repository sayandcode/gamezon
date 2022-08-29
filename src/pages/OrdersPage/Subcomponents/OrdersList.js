import { Divider, Skeleton, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { resourcePropType } from '../../../utlis/SuspenseHelpers';
import OrdersListItem from './OrdersListItem';

function OrdersList({ ordersDataResource }) {
  const ordersData = ordersDataResource.read();
  return (
    <Stack divider={<Divider />} spacing={2}>
      {ordersData.map((order) => (
        <OrdersListItem key={order.id} order={order} />
      ))}
    </Stack>
  );
}

OrdersList.propTypes = {
  ordersDataResource: resourcePropType.isRequired,
};

function OrdersListFallback({ count }) {
  return (
    <Stack divider={<Divider />} spacing={2}>
      {Array.from(Array(count)).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={i} height="150px" />
      ))}
    </Stack>
  );
}

OrdersListFallback.propTypes = {
  count: PropTypes.number.isRequired,
};

export default OrdersList;
export { OrdersListFallback };
