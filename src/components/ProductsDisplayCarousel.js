import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AddShoppingCart as AddShoppingCartIcon,
  RemoveShoppingCart as RemoveShoppingCartIcon,
  ReceiptLong as ReceiptLongIcon,
  PlaylistRemove as PlaylistRemoveIcon,
  ErrorOutline as ErrorOutlineIcon,
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
import {
  useRef,
  useState,
  useContext,
  Suspense,
  useEffect,
  useReducer,
} from 'react';
import { Link } from 'react-router-dom';
import useMeasure from 'react-use-measure';
import toPX from 'to-px';
import { ErrorBoundary } from 'react-error-boundary';
import customTheme from '../CustomTheme';
import { ProductsDisplayCarouselItem } from '../utlis/DBHandlers/DBDataConverter';
import { GameDatabaseQuery } from '../utlis/DBHandlers/DBQueryClasses';
import { getDataFromQuery } from '../utlis/DBHandlers/MockDBFetch'; // BEFORE PRODUCTION: change 'MockDBFetch' to 'DBFetch' for production
import ContainedIconButton from './ContainedIconButton';
import ExpandingButton from './ExpandingButton';
import { UserContext } from '../utlis/Contexts/UserData/UserContext';
import { GameDatabase } from '../utlis/DBHandlers/DBManipulatorClasses';
import { wrapPromise } from '../utlis/SuspenseHelpers';

const CAROUSEL_ITEM_HEIGHT = '250px';
const CAROUSEL_ITEM_WIDTH = '150px';
const CAROUSEL_SPACING = customTheme.spacing(2);

export default function ProductsDisplayCarousel({ title, items }) {
  /* UTILITIES */
  const [CarouselStackRef, { width: carouselStackWidth }] = useMeasure();
  const [manualUpdateCounter, manualUpdate] = useReducer((x) => x + 1, 0);

  /* DATA STORE */
  const itemsCache = useRef([]);
  const highestIndex = itemsCache.current.length - 1;

  /* COUNTS */
  const itemCount = Math.floor(
    carouselStackWidth / (toPX(CAROUSEL_ITEM_WIDTH) + toPX(CAROUSEL_SPACING))
  );
  const [rangeStart, setRangeStart] = useState(0);
  const rangeEnd = rangeStart + itemCount - 1;

  /* FLAGS */
  const [flags, setFlags] = useState({ moreItemsAvailable: true });

  function getDataFromCache() {
    async function fetchingFn() {
      // if the required data is already in cache, return it.
      // else wait for us to fetch it from database
      if (rangeEnd <= highestIndex)
        return itemsCache.current.slice(rangeStart, rangeEnd + 1); // +1 for how slice works

      let queriedItems;

      /* FUNCTION OVERLOADING V1: ITEMS IS A DBQUERY */
      if (items instanceof GameDatabaseQuery) {
        // take the last item in the carouselItems array, and start at that one.
        // That way, we query only the ones that are extra
        const lastFetchedItem = itemsCache.current.slice(-1)[0];
        const noOfItemsToFetch = rangeEnd - highestIndex + 1; // fetch one extra, to see if there are more items available
        const subsetQuery = items
          .limit(noOfItemsToFetch)
          .startAfter(lastFetchedItem); // startAfter method can also work with undefined. It just ignores the call
        queriedItems = await getDataFromQuery(subsetQuery);

        const extraItem = queriedItems[noOfItemsToFetch - 1]; // (noOfItemsToFetch - 1) is the last item cause thats how indexes work
        setFlags((old) => ({ ...old, moreItemsAvailable: !!extraItem }));
      }

      /* FUNCTION OVERLOADING V2: ITEMS IS AN ARRAY */
      // eslint-disable-next-line prettier/prettier
      else if (Array.isArray(items)) {
        const startIndex = highestIndex === -1 ? 0 : highestIndex + 1;
        queriedItems = await Promise.all(
          items
            .slice(startIndex, rangeEnd + 1)
            .map((_title) => GameDatabase.get({ title: _title }))
        );

        const finalArrayLength =
          itemsCache.current.length + queriedItems.length;
        const moreItemsAvailable = items.length > finalArrayLength;
        setFlags((old) => ({ ...old, moreItemsAvailable }));
      }

      const newCarouselItems = await Promise.allSettledFiltered(
        queriedItems.map(async (item) =>
          ProductsDisplayCarouselItem.createFrom(item)
        )
      );
      itemsCache.current.push(...newCarouselItems);
      // finally return the fetched items
      return itemsCache.current.slice(rangeStart, rangeEnd + 1); // +1 for how slice works
    }

    return wrapPromise(fetchingFn());
  }

  /* PROVIDE ITEMSRESOURCE */
  const [itemsResource, setItemsResource] = useState(
    wrapPromise(new Promise(() => {}))
  );
  useEffect(updateCache, [rangeStart, itemCount, manualUpdateCounter]);
  function updateCache() {
    if (itemCount === 0) return;
    const newResource = getDataFromCache();
    setItemsResource(newResource);
  }

  /* EMPTY CACHE ON ITEMS PROP CHANGE */
  useEffect(() => {
    itemsCache.current = [];
    setRangeStart(0);
    manualUpdate();
  }, [items]);

  /* RUNTIME CALCULATIONS */
  const showArrow = {
    left: rangeStart !== 0,
    right: flags.moreItemsAvailable || rangeEnd < highestIndex,
  };
  const changePage = ({ forward }) => {
    setRangeStart((oldRangeStart) => {
      const offset = (forward ? 1 : -1) * itemCount;
      const newCurr = oldRangeStart + offset;
      return newCurr < 0 ? 0 : newCurr;
    });
  };

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
        <ErrorBoundary fallback={<Error />}>
          <Suspense fallback={<CarouselSkeletons count={itemCount} />}>
            <CarouselItems
              resource={itemsResource}
              showArrow={showArrow}
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

function CarouselItems({ resource, showArrow, changePage }) {
  const data = resource.read();

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
      {data.length > 0 ? (
        <Stack direction="row" spacing={CAROUSEL_SPACING} px={3}>
          {data.map((item) => (
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
  showArrow: PropTypes.shape({ left: PropTypes.bool, right: PropTypes.bool })
    .isRequired,
  resource: PropTypes.shape({ read: PropTypes.func }).isRequired,
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
  const { cart, wishlist } = useContext(UserContext);

  // The component maintains its own clicked state, as we want users to be
  // able to add an additional item to their cart. It isn't intended to perform
  // the full functionality of manipulating the cart
  const [addedToCart, setAddedToCart] = useState(false);
  const addedToWishlist = wishlist.find(item.title);

  const handleCartClick = () => {
    if (addedToCart) cart.remove(item.title, item.variant);
    else cart.add(item.title, item.variant);
    setAddedToCart((old) => !old);
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
            content: `"${item.discount.price}"`,
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
            {item.price}
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
  item: PropTypes.instanceOf(ProductsDisplayCarouselItem).isRequired,
};

function Error() {
  return (
    <Stack alignItems="center" width="100%">
      <Typography
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        variant="h6"
        color="error"
      >
        <ErrorOutlineIcon sx={{ mr: 1 }} />
        Oops! Something went wrong...
      </Typography>
      <Typography variant="subtitle2" color="error">
        Refresh the page and try again
      </Typography>
    </Stack>
  );
}
