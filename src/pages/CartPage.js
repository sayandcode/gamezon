import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState, useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
  Remove,
  RemoveShoppingCart as RemoveShoppingCartIcon,
} from '@mui/icons-material';
import { NotificationSnackbarContext } from '../utlis/Contexts/NotificationSnackbarContext';
import { UserContext } from '../utlis/Contexts/UserData/UserContext';
import { CartItemDataHandler } from '../utlis/DBHandlers/DBDataConverter';
import { GameDatabase } from '../utlis/DBHandlers/DBManipulatorClasses';
import ExpandingButton from '../components/ExpandingButton';

function Cart() {
  // We depend on the local state for cart instead of fetching it again in this component.
  // This is because there is the task is done anyway by the UserContext.
  const { cart } = useContext(UserContext);
  const [cartData, setCartData] = useState();
  const cartDataRef = useRef();

  const { showNotificationWith } = useContext(NotificationSnackbarContext);

  /* INITIAL CART ITEMS DATA FETCH */
  const fetchedDataFLAG = useRef(false);
  useEffect(() => {
    //  If we have already fetched the data, then ignore any subsequent fetch requests.
    //  No new items can be added from Cart(this) page, so the initial fetch includes the superset
    //  of all needed items
    const needToFetchItems =
      !fetchedDataFLAG.current && cart.contents.length > 0; // no point fetching if cart is empty

    if (needToFetchItems) getCartData();

    async function getCartData() {
      let newCartItems;
      try {
        newCartItems = await Promise.all(
          cart.contents.map(async (item) => {
            const cartItemDoc = await GameDatabase.get({ title: item.name });
            const cartItem = await CartItemDataHandler.createFrom(
              cartItemDoc,
              item.variant,
              item.count
            );
            return cartItem;
          })
        );
      } catch (err) {
        showNotificationWith({
          message:
            'Could not fetch cart items. Please refresh the page, and try again',
          variant: 'error',
        });
      }

      cartDataRef.current = newCartItems;
      setCartData(newCartItems);
    }

    // The ref allows us to access the state that was set above, as the (async)fetch
    // runs after the useEffect cleanup is set
    return () => cartDataRef.current?.forEach((item) => item.dispose());
  }, [cart]);

  return (
    <Stack m={2} spacing={2}>
      <Paper sx={{ p: 4 }}>
        <Stack direction="row" alignItems="center">
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="text.primary"
            display="inline-block"
            gutterBottom
          >
            My Cart
          </Typography>
          {cart.contents.length !== 0 && (
            <ExpandingButton
              buttonIcon={<RemoveShoppingCartIcon />}
              textContent="Empty Cart "
              expandDir="left"
              size="small"
              sx={{ ml: 'auto', transform: 'translateY(-7.5px)' }}
              onClick={() => cart.empty()}
            />
          )}
        </Stack>
        {cart.contents.length ? (
          <>
            <Stack divider={<Divider />} spacing={2}>
              {cartData
                ? cartData.map((item) => (
                    <CartItem key={item.productID} item={item} />
                  ))
                : cart.contents.map((_, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Skeleton key={i} height="150px" />
                  ))}
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="h4"
              color="text.primary"
              fontWeight="bold"
              gutterBottom
              textAlign="right"
            >
              Cart Total: $
              {cartData ? (
                cartData
                  .reduce(
                    (sum, currItem) =>
                      sum + Number(currItem.totalPrice.slice(1)),
                    0
                  )
                  .toFixed(2) // cause JS is bad at math
              ) : (
                <Skeleton sx={{ display: 'inline-block' }} width="100px" />
              )}
            </Typography>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{
                borderRadius: (theme) => theme.shape.borderRadius * 2,
                position: 'fixed',
                bottom: (theme) => theme.spacing(5),
                right: (theme) => theme.spacing(5),
                zIndex: 20,
                fontSize: (theme) => theme.typography.h6.fontSize,
              }}
              endIcon={<ArrowForwardIcon />}
              /* TODO:  Handle checkout */
              onClick={() => console.log('Handle Checkout')}
            >
              Checkout
            </Button>
          </>
        ) : (
          <Typography
            variant="h6"
            component="h2"
            sx={{ p: 4, textAlign: 'center' }}
          >
            Nothing in cart. Add something!
          </Typography>
        )}
      </Paper>
    </Stack>
  );
}

function CartItem({ item }) {
  const { cart } = useContext(UserContext);

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
        src={item.boxArtUrl}
        title={item.title}
        sx={{
          display: 'block',
          maxHeight: '150px',
          objectFit: 'cover',
          objectPosition: 'top',
          justifySelf: 'center',
        }}
      />
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h6" component="h2">
          {item.title}
        </Typography>
        <Typography variant="body2" component="h3">
          Variant: {item.variant}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Price: {item.price}
        </Typography>
        <ButtonGroup sx={{ mt: '1em', position: 'relative' }}>
          <Button
            variant="contained"
            sx={{
              zIndex: 2,
            }}
            onClick={() => cart.remove(item.title, item.variant)}
          >
            <Remove />
          </Button>
          <Stack
            justifyContent="center"
            px={2}
            sx={{
              color: 'text.primary',
              bgcolor: 'white',
              zIndex: 2,
              borderBlock: '2px solid black',
            }}
          >
            {item.count}
          </Stack>
          <Button
            variant="contained"
            sx={{
              zIndex: 2,
            }}
            onClick={() => cart.add(item.title, item.variant)}
          >
            <AddIcon />
          </Button>
        </ButtonGroup>
        <Typography
          sx={{ position: 'absolute', right: 0, bottom: 0 }}
          component="h3"
        >
          Item Total:&nbsp;
          <Typography display="inline" variant="h6" component="span">
            {item.totalPrice}
          </Typography>
        </Typography>
        <ExpandingButton
          buttonIcon={<DeleteIcon />}
          textContent="Remove From Cart "
          expandDir="left"
          size="small"
          sx={{ position: 'absolute', top: 0, right: 0 }}
          onClick={() => cart.remove(item.title, item.variant, { all: true })}
        />
      </Box>
    </Box>
  );
}

CartItem.propTypes = {
  item: PropTypes.instanceOf(CartItemDataHandler).isRequired,
};

export default Cart;
