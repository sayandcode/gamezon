import { Divider, Skeleton, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import Cart from '../../../utlis/Contexts/UserData/UserDataHelperClasses/Cart';
import { resourcePropType } from '../../../utlis/SuspenseHelpers';

function CheckoutList({ checkoutItemsDataResource }) {
  const checkoutData = checkoutItemsDataResource.read();

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
            {item.totalPrice.print()}
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
          {checkoutData.cartTotalPrice.print()}
        </Typography>
      </Stack>
    </Stack>
  );
}

CheckoutList.propTypes = {
  checkoutItemsDataResource: resourcePropType.isRequired,
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

export default CheckoutList;
export { CheckoutItemsListFallback };
