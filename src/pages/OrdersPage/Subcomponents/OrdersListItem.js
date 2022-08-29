import {
  Done as TickIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Box, Button, Collapse, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import OrderHandler from '../Helpers/OrderHandler';
import OrdersListItemExpanded from './OrdersListItemExpanded';

function OrdersListItem({ order }) {
  /* COMPONENT STATE */
  const [isCollapsed, setIsCollapsed] = useState(true);

  /* RUNTIME CALCULATIONS */
  let slabTitle = order.items[0].name;
  if (order.items.length > 1)
    slabTitle += ` and ${order.items.length - 1} other item`;
  if (order.items.length > 2) slabTitle += 's';

  const buttonContent = isCollapsed ? (
    <>
      More Details <ExpandMoreIcon />
    </>
  ) : (
    <>
      Less Details <ExpandLessIcon />
    </>
  );
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 4fr',
        columnGap: 1,
      }}
    >
      <Box
        component="img"
        src={order.displayPic}
        alt="Image of first item in order"
        sx={{
          display: 'block',
          maxHeight: '150px',
          objectFit: 'cover',
          objectPosition: 'top',
          justifySelf: 'center',
        }}
      />
      <Box position="relative">
        <Typography variant="h6" component="h2">
          {slabTitle}
        </Typography>
        <Typography variant="overline" component="h3">
          Ordered on: {order.date}
        </Typography>
        <Typography variant="subtitle2" component="h3" gutterBottom>
          Order Total: {order.totalPrice.print()}
        </Typography>
        <Stack spacing={1} ml={2}>
          {order.selectedDeliveryOptions.map((option) => (
            <Typography
              key={option.name}
              variant="body2"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <TickIcon /> {option.label}
            </Typography>
          ))}
        </Stack>
        <Button
          variant="text"
          sx={{ display: 'flex', position: 'absolute', bottom: 0, right: 0 }}
          onClick={() => setIsCollapsed((old) => !old)}
        >
          {buttonContent}
        </Button>
        <Collapse in={!isCollapsed}>
          <OrdersListItemExpanded order={order} />
        </Collapse>
      </Box>
    </Box>
  );
}

OrdersListItem.propTypes = {
  order: PropTypes.instanceOf(OrderHandler).isRequired,
};

export default OrdersListItem;
