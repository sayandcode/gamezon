import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AddShoppingCart as AddShoppingCartIcon,
  RemoveShoppingCart as RemoveShoppingCartIcon,
  ReceiptLong as ReceiptLongIcon,
  PlaylistRemove as PlaylistRemoveIcon,
} from '@mui/icons-material';
import {
  Box,
  darken,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useState, useContext, Suspense, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import useMeasure from 'react-use-measure';
import toPX from 'to-px';
import { ErrorBoundary } from 'react-error-boundary';
import customTheme from '../../CustomTheme';
import { GameDatabaseQuery } from '../../utlis/DBHandlers/DBQueryClasses';
import ContainedIconButton from '../ContainedIconButton';
import ExpandingButton from '../ExpandingButton';
import { UserContext } from '../../utlis/Contexts/UserData/UserContext';
import { useResource } from '../../utlis/SuspenseHelpers';
import ErrorMessage from '../ErrorMessage';
import ProductsDisplayCarouselDataHandler from './Helpers/ProductsDisplayCarouselDataHandler';
import ProductsDisplayCarouselItemHandler from './Helpers/ProductsDisplayCarouselItemHandler';

const CAROUSEL_ITEM_HEIGHT = '250px';
const CAROUSEL_ITEM_WIDTH = '150px';
const CAROUSEL_SPACING = customTheme.spacing(2);

export default function ProductsDisplayCarousel({ title, items }) {
  /* UTILITIES */
  const [CarouselStackRef, { width: carouselStackWidth }] = useMeasure();
  const [manualUpdateCounter, manualUpdate] = useReducer((x) => x + 1, 0);

  /* COUNTS */
  const itemCount = Math.floor(
    carouselStackWidth / (toPX(CAROUSEL_ITEM_WIDTH) + toPX(CAROUSEL_SPACING))
  );
  const [rangeStart, setRangeStart] = useState(0);
  const rangeEnd = rangeStart + itemCount - 1;

  /* PROVIDE ITEMSRESOURCE */
  const dataResource = useResource(getProductDisplayCarouselData, [
    rangeStart,
    itemCount,
    manualUpdateCounter,
  ]);

  /* EMPTY CACHE ON ITEMS PROP CHANGE */
  useEffect(() => {
    ProductsDisplayCarouselDataHandler.clearCache();
    setRangeStart(0);
    manualUpdate();
  }, [items]);

  /* DISPOSE OF THE DATA WHEN COMPONENT IS UNMOUNTED */
  useEffect(() => ProductsDisplayCarouselDataHandler.clearCache(), []);

  /* RUNTIME CALCULATIONS */
  const changePage = ({ forward }) => {
    setRangeStart((oldRangeStart) => {
      const offset = (forward ? 1 : -1) * itemCount;
      const newCurr = oldRangeStart + offset;
      return newCurr < 0 ? 0 : newCurr;
    });
  };

  /* FUNCTION DEFINITIONS */
  function getProductDisplayCarouselData() {
    return ProductsDisplayCarouselDataHandler.createFor(items, {
      rangeStart,
      rangeEnd,
    });
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', m: 2, py: 1, px: 2 }}>
      <Typography variant="h5" as="h3" sx={{ fontWeight: 'bold' }} gutterBottom>
        {title}
      </Typography>
      <Divider />
      <Stack
        direction="row"
        my={2}
        position="relative"
        alignItems="center"
        ref={CarouselStackRef}
      >
        <ErrorBoundary fallback={<ErrorFallback />}>
          <Suspense fallback={<CarouselSkeletons count={itemCount} />}>
            <CarouselItems
              dataResource={dataResource}
              changePage={changePage}
            />
          </Suspense>
        </ErrorBoundary>
      </Stack>
    </Box>
  );
}

ProductsDisplayCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.oneOfType([
    PropTypes.instanceOf(GameDatabaseQuery),
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
};

function CarouselItems({ dataResource, changePage }) {
  const dataHandler = dataResource.read();
  const { showArrow, carouselItems } = dataHandler;

  return (
    <>
      <ContainedIconButton
        color="primary"
        sx={{
          position: 'absolute',
          left: 0,
          visibility: showArrow.left ? 'visible' : 'hidden',
        }}
        onClick={() => changePage({ forward: false })}
      >
        <ChevronLeftIcon />
      </ContainedIconButton>
      {carouselItems.length > 0 ? (
        <Stack direction="row" spacing={CAROUSEL_SPACING} px={3}>
          {carouselItems.map((item) => (
            <CarouselItem key={item.title} item={item} />
          ))}
        </Stack>
      ) : (
        <Typography
          sx={{
            height: CAROUSEL_ITEM_HEIGHT,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          variant="h6"
        >
          Nothing to show!
        </Typography>
      )}
      <ContainedIconButton
        color="primary"
        sx={{
          position: 'absolute',
          right: 0,
          visibility: showArrow.right ? 'visible' : 'hidden',
        }}
        onClick={() => changePage({ forward: true })}
      >
        <ChevronRightIcon />
      </ContainedIconButton>
    </>
  );
}

CarouselItems.propTypes = {
  dataResource: PropTypes.shape({ read: PropTypes.func }).isRequired,
  changePage: PropTypes.func.isRequired,
};

function CarouselSkeletons({ count }) {
  const arr = Array.from(Array(count));
  return (
    <Stack direction="row" spacing={CAROUSEL_SPACING} px={3}>
      {arr.map((_, i) => (
        <Skeleton
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          sx={{ height: CAROUSEL_ITEM_HEIGHT, width: CAROUSEL_ITEM_WIDTH }}
        />
      ))}
    </Stack>
  );
}
CarouselSkeletons.propTypes = {
  count: PropTypes.number.isRequired,
};

function CarouselItem({ item }) {
  const { user, cart, wishlist } = useContext(UserContext);

  // The component maintains its own clicked state, as we want users to be
  // able to add an additional item to their cart. It isn't intended to perform
  // the full functionality of manipulating the cart
  const [addedToCart, setAddedToCart] = useState(false);
  const addedToWishlist = wishlist.find(item.title);

  const handleCartClick = () => {
    // The cart will handle logging the user in
    if (addedToCart) cart.remove(item.title, item.variant);
    else cart.add(item.title, item.variant);
    // This prevents the button state from being changed, unless theres no user
    if (user) setAddedToCart((old) => !old);
  };
  return (
    <Paper
      sx={{
        width: CAROUSEL_ITEM_WIDTH,
        height: CAROUSEL_ITEM_HEIGHT,
        position: 'relative',
        '.CarouselItem-discountSticker::after': {
          content: `"${item.discount.percent}% OFF"`,
        },
        '&:hover': {
          '.CarouselItem-discountSticker::after': {
            content: `"${item.discount.price.print()}"`,
          },
          '.CarouselItem-originalPrice': {
            textDecoration: item.discount && 'line-through',
          },
        },
      }}
    >
      <Link to={`/product/${encodeURIComponent(item.title)}`}>
        <Box
          component="img"
          src={item.boxArtUrl}
          title={item.title}
          sx={{
            display: 'block',
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            objectPosition: 'top',
            cursor: 'pointer',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: (theme) => theme.spacing(1),
            right: (theme) => theme.spacing(1),
            fontWeight: (theme) => theme.typography.fontWeightMedium,
            fontSize: (theme) => theme.typography.fontSize,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          {item.discount && (
            <Box
              sx={{
                bgcolor: (theme) => darken(theme.palette.secondary.main, 0.1),
                color: (theme) => theme.palette.secondary.contrastText,
                px: 1,
                py: 0.5,
                borderRadius: (theme) => theme.shape.borderRadius,
                transition: 'all 2s',
              }}
              className="CarouselItem-discountSticker"
            />
          )}
          <Box
            sx={{
              bgcolor: (theme) => darken(theme.palette.background.paper, 0.1),
              color: (theme) => theme.palette.text.primary,
              px: 1,
              py: 0.5,
              borderRadius: (theme) => theme.shape.borderRadius,
              position: 'relative',
            }}
            className="CarouselItem-originalPrice"
          >
            {item.price.print()}
          </Box>
        </Box>
      </Link>
      <Stack direction="row" justifyContent="space-between" p={1}>
        <ExpandingButton
          textContent={!addedToCart ? 'Add to Cart' : 'Remove from Cart'}
          buttonIcon={
            !addedToCart ? <AddShoppingCartIcon /> : <RemoveShoppingCartIcon />
          }
          expandDir="right"
          onClick={handleCartClick}
        />
        <ExpandingButton
          textContent={
            !addedToWishlist ? 'Add to Wishlist' : 'Remove from Wishlist'
          }
          buttonIcon={
            !addedToWishlist ? <ReceiptLongIcon /> : <PlaylistRemoveIcon />
          }
          expandDir="left"
          onClick={() => wishlist.toggle(item.title)}
        />
      </Stack>
    </Paper>
  );
}

CarouselItem.propTypes = {
  item: PropTypes.instanceOf(ProductsDisplayCarouselItemHandler).isRequired,
};

function ErrorFallback() {
  return (
    <Stack alignItems="center" width="100%">
      <ErrorMessage />
    </Stack>
  );
}
