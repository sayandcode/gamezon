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
import { useState, useEffect, useContext, useRef, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
  Remove,
  RemoveShoppingCart as RemoveShoppingCartIcon,
} from '@mui/icons-material';
import { ErrorBoundary } from 'react-error-boundary';
import { UserContext } from '../../utlis/Contexts/UserData/UserContext';
import { CartItemDataHandler } from '../../utlis/DBHandlers/DBDataConverter';
import ExpandingButton from '../../components/ExpandingButton';
import { promiseToResource } from '../../utlis/SuspenseHelpers';
import ErrorMessage from '../../components/ErrorMessage';
import { CartProductDataCache } from './CartPageHelpers';

function CartPage() {
  const { cart } = useContext(UserContext);
  const cartContents = Object.values(cart.contents);
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
          {cartContents.length !== 0 && (
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
        {cartContents.length > 0 ? (
          <CartContents />
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

function CartContents() {
  const { cart } = useContext(UserContext);
  const productDataCache = useRef(new CartProductDataCache());

  /* CART DATA RESOURCE */
  const [cartDataResource, setCartDataResource] = useState(
    promiseToResource(new Promise(() => {}))
  );
  useEffect(updateCartDataResource, [cart]);

  /* CLEAN UP MEMORY LEAKS WHEN COMPONENT IS UNMOUNTED */
  useEffect(() => {
    return () => productDataCache.current.dispose();
  }, []);

  /* FUNCTION DECLARATIONS */
  function updateCartDataResource() {
    const newResource = promiseToResource(getCartItemsData());
    setCartDataResource(newResource);
  }

  async function getCartItemsData() {
    const cartProductsIDs = Object.keys(cart.contents);
    const cachedProductsIDs = productDataCache.current.productIDs;
    const nonCachedProductsIDs = cartProductsIDs.filter(
      (id) => !cachedProductsIDs.includes(id)
    );

    if (nonCachedProductsIDs.length > 0) await updateCache();
    return generateCartItemsData();

    async function updateCache() {
      filterCache(cartProductsIDs);
      await addToCache(nonCachedProductsIDs);

      function filterCache(requiredIDs) {
        const requiredCartItems = requiredIDs.map((id) => cart.contents[id]);
        productDataCache.current.filter(requiredCartItems);
      }

      async function addToCache(requiredIDs) {
        const requiredCartItems = requiredIDs.map((id) => cart.contents[id]);
        await Promise.all(
          requiredCartItems.map(async (item) =>
            productDataCache.current.addToCache(item)
          )
        );
      }
    }

    function generateCartItemsData() {
      // The cartItemsData has two parts: The productData and cartData.
      // Since cart data is updated anyway, and is driving the whole thing, nothing to optimise there.
      // But productData doesn't change, so we can cache it locally.
      // Hence the cartItemsData is generated dynamically, with the constant productData, and the changing cartData
      const cartItems = Object.values(cart.contents);
      return cartItems.map((item) =>
        productDataCache.current.generateHandlerFor(item)
      );
    }
  }
  return (
    <>
      <Stack divider={<Divider />} spacing={2}>
        <ErrorBoundary
          fallback={
            <Stack py={2}>
              <ErrorMessage />
            </Stack>
          }
        >
          <Suspense
            fallback={Object.keys(cart.contents).map((key) => (
              <Skeleton key={key} height="150px" />
            ))}
          >
            <CartItems cartDataResource={cartDataResource} />
          </Suspense>
        </ErrorBoundary>
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
        <ErrorBoundary fallback={<ErrorIcon sx={{ color: 'error.main' }} />}>
          <Suspense
            fallback={
              <Skeleton sx={{ display: 'inline-block' }} width="100px" />
            }
          >
            <CartTotal cartDataResource={cartDataResource} />
          </Suspense>
        </ErrorBoundary>
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
  );
}

function CartItems({ cartDataResource }) {
  const cartData = cartDataResource.read();
  return cartData.map((item) => <CartItem key={item.productID} item={item} />);
}

CartItems.propTypes = {
  cartDataResource: PropTypes.shape({ read: PropTypes.func }).isRequired,
};

function CartTotal({ cartDataResource }) {
  const cartData = cartDataResource.read();
  const totalAmt = cartData
    .reduce((sum, currItem) => {
      const currTotalPrice = Number(currItem.totalPrice.slice(1));
      return sum + currTotalPrice;
    }, 0)
    .toFixed(2); // cause JS is bad at math
  return totalAmt;
}

CartTotal.propTypes = {
  cartDataResource: PropTypes.shape({ read: PropTypes.func }).isRequired,
};

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

export default CartPage;
