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
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useMeasure from 'react-use-measure';
import toPX from 'to-px';
import { flushSync } from 'react-dom';
import customTheme from '../CustomTheme';
import { ProductsDisplayCarouselItem } from '../utlis/DBHandlers/DBDataConverter';
import { DatabaseQuery } from '../utlis/DBHandlers/DBQueryClasses';
import { getDataFromQuery } from '../utlis/DBHandlers/MockDBFetch'; // BEFORE PRODUCTION: change 'MockDBFetch' to 'DBFetch' for production
import SequentialExecutionQueue from '../utlis/SequentialExecutionQueue';
import ContainedIconButton from './ContainedIconButton';
import ExpandingButton from './ExpandingButton';

const CAROUSEL_ITEM_HEIGHT = '250px';
const CAROUSEL_ITEM_WIDTH = '150px';
const CAROUSEL_SPACING = customTheme.spacing(2);

export default function ProductsDisplayCarousel({ title, itemsQuery }) {
  return (
    <Box sx={{ bgcolor: 'grey.50', m: 2, py: 1, px: 2 }}>
      <Typography variant="h5" as="h3" sx={{ fontWeight: 'bold' }} gutterBottom>
        {title}
      </Typography>
      <Divider />
      <CarouselContainer itemsQuery={itemsQuery} />
    </Box>
  );
}

ProductsDisplayCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  itemsQuery: PropTypes.instanceOf(DatabaseQuery).isRequired,
};

function CarouselContainer({ itemsQuery }) {
  const [CarouselStackRef, { width: carouselStackWidth }] = useMeasure();
  const itemCount = Math.floor(
    carouselStackWidth / (toPX(CAROUSEL_ITEM_WIDTH) + toPX(CAROUSEL_SPACING))
  );

  const [carouselItems, setCarouselItems] = useState([]);
  const carousel = useRef(carouselItems);
  const [moreItemsAvailable, setMoreItemsAvailable] = useState(true);
  const [rangeStart, setRangeStart] = useState(0);

  // FETCH CAROUSEL ITEMS
  const stackRef = useRef(new SequentialExecutionQueue());
  const [fetchInProcess, setFetchInProcess] = useState(false); // this is a flag

  useEffect(() => {
    // We run the fetch function only after the previous one has completed
    // That way, the function always has access to the latest state of carouselItems
    // and thus fetches only the extra ones needed, despite an additional network request
    // The stack is the only way this will work with resizes also
    stackRef.current.push(getCarouselItems);

    async function getCarouselItems() {
      // any time the last index is greater than number of items in the carousel items
      // we fetch the new items, and add them to the carouselItems buffer
      const highestIndex = carousel.current.length - 1;
      const rangeEnd = rangeStart + itemCount - 1;
      const reachedCarouselEnd = rangeEnd > highestIndex;
      if (!itemCount || !reachedCarouselEnd || !moreItemsAvailable) return;

      setFetchInProcess(true); // prevent clicks when loading

      // take the last item in the carouselItems array, and start at that one.
      // That way, we query only the ones that are extra
      const lastFetchedItem = carousel.current.slice(-1)[0];
      const noOfItemsToFetch = rangeEnd - highestIndex + 1; // fetch one extra, to see if there are more items available
      const subsetQuery = itemsQuery
        .limit(noOfItemsToFetch)
        .startAfter(lastFetchedItem); // startAfter method can also work with undefined. It just ignores the call

      const queriedItems = await getDataFromQuery(subsetQuery);
      const extraItem = queriedItems[noOfItemsToFetch - 1]; // (noOfItemsToFetch - 1) is the last item cause thats how indexes work
      if (extraItem) setMoreItemsAvailable(true);
      else setMoreItemsAvailable(false);

      const newCarouselItems = await Promise.allSettledFiltered(
        queriedItems.map(async (item) =>
          ProductsDisplayCarouselItem.createFrom(item)
        )
      );

      // make sure the setState completes before dequeuing the task
      flushSync(() => {
        setCarouselItems((oldItems) => {
          const newItems = [...oldItems, ...newCarouselItems];
          carousel.current = newItems;
          return newItems;
        });
      });
      setFetchInProcess(false);
    }
  }, [rangeStart, itemCount]);

  const changePage = ({ forward }) => {
    const offset = (forward ? 1 : -1) * itemCount;
    const newCurr = rangeStart + offset;

    setRangeStart(newCurr < 0 ? 0 : newCurr);
  };

  return (
    <Stack
      direction="row"
      my={2}
      position="relative"
      alignItems="center"
      ref={CarouselStackRef}
    >
      <ContainedIconButton
        color="primary"
        sx={{
          position: 'absolute',
          left: 0,
          visibility: rangeStart === 0 ? 'hidden' : 'visible',
        }}
        onClick={() => changePage({ forward: false })}
      >
        <ChevronLeftIcon />
      </ContainedIconButton>
      <Stack direction="row" spacing={CAROUSEL_SPACING} px={3}>
        {Array.from(Array(itemCount)).map((_, i) => {
          const indexInCarousel = rangeStart + i;
          // if the item exists then show it
          if (carouselItems[indexInCarousel])
            return (
              <CarouselItem
                key={indexInCarousel}
                item={carouselItems[indexInCarousel]}
              />
            );
          // if theres something to be fetched show a skeleton, else show nothing
          return fetchInProcess ? (
            <Skeleton
              key={indexInCarousel}
              sx={{
                width: CAROUSEL_ITEM_WIDTH,
                height: CAROUSEL_ITEM_HEIGHT,
              }}
            />
          ) : undefined;
        })}
      </Stack>
      <ContainedIconButton
        color="primary"
        sx={{
          position: 'absolute',
          right: 0,
          visibility:
            fetchInProcess ||
            (!moreItemsAvailable &&
              rangeStart + itemCount > carouselItems.length - 1) // current rangeEnd Index < last index fetched
              ? 'hidden'
              : 'visible',
        }}
        onClick={() => changePage({ forward: true })}
      >
        <ChevronRightIcon />
      </ContainedIconButton>
    </Stack>
  );
}

CarouselContainer.propTypes = {
  itemsQuery: PropTypes.instanceOf(DatabaseQuery).isRequired,
};

function CarouselItem({ item }) {
  const [clicked, setClicked] = useState(false);

  return (
    <Paper sx={{ width: CAROUSEL_ITEM_WIDTH, height: CAROUSEL_ITEM_HEIGHT }}>
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
      </Link>
      <Stack direction="row" justifyContent="space-between" p={1}>
        <ExpandingButton
          clicked={clicked} /* make this dynamic from cart, and wishlist */
          unclickedText="Add to Cart"
          clickedText="Remove from Cart"
          unclickedIcon={<AddShoppingCartIcon />}
          clickedIcon={<RemoveShoppingCartIcon />}
          size="large"
          expandDir="right"
          onClick={() => setClicked((old) => !old)}
        />
        <ExpandingButton
          clicked={clicked} /* make this dynamic from cart, and wishlist */
          unclickedText="Add to Wishlist"
          clickedText="Remove from Wishlist"
          unclickedIcon={<ReceiptLongIcon />}
          clickedIcon={<PlaylistRemoveIcon />}
          size="large"
          expandDir="left"
          onClick={() => setClicked((old) => !old)}
        />
      </Stack>
    </Paper>
  );
}

CarouselItem.propTypes = {
  item: PropTypes.instanceOf(ProductsDisplayCarouselItem).isRequired,
};
