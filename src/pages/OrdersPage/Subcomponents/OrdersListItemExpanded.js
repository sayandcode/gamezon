import { Box, Divider, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
import OrderHandler from '../Helpers/OrderHandler';

function OrdersListItemExpanded({ order }) {
  const addressContent = order.address.content;
  const {
    firstName,
    lastName,
    phoneNumber,
    addressLine1,
    addressLine2,
    country,
    city,
    state,
  } = addressContent;

  const processedAddressLine2 = addressLine2 ? `\n${addressLine2}` : '';
  let region = `\n${country.label}`;
  if (state) region = `${region}, ${state.label}`;
  if (city) region = `${region}, ${city.label}`;
  const readablePhoneNumber = formatPhoneNumberIntl(phoneNumber);

  const recipient = `${firstName} ${lastName}`;
  const line = [];
  line[0] = `Phone No:${readablePhoneNumber}`;
  line[1] = `${addressLine1}${processedAddressLine2}${region}`;

  return (
    <Box>
      <Stack
        sx={{
          bgcolor: 'grey.100',
          my: 2,
          mr: '30%',
        }}
        divider={<Divider />}
      >
        {order.items.map((item) => (
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
            <Typography variant="subtitle1" fontWeight="bold" ml="auto" pl={1}>
              {item.totalPrice.print()}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Typography variant="body1">Delivering to:</Typography>
      <Box ml={2}>
        <Typography variant="h6">{recipient}</Typography>
        <Typography variant="subtitle2">{line[0]}</Typography>
        <Typography
          variant="subtitle1"
          sx={{
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}
        >
          {line[1]}
        </Typography>
      </Box>
    </Box>
  );
}

OrdersListItemExpanded.propTypes = {
  order: PropTypes.instanceOf(OrderHandler).isRequired,
};

export default OrdersListItemExpanded;
