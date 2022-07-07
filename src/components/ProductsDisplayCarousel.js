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
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useMeasure from 'react-use-measure';
import toPX from 'to-px';
import customTheme from '../CustomTheme';
import { ProductsDisplayCarouselItem } from '../utlis/DBHandlers/DBDataConverter';
import { DatabaseQuery } from '../utlis/DBHandlers/DBQueryClasses';
import { getDataFromQuery } from '../utlis/DBHandlers/MockDBFetch';
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
  const [currRangeStart, setcurrRangeStart] = useState(0);

  const [carouselItems, setCarouselItems] = useState();
  // FETCH CAROUSEL ITEMS
  useEffect(() => {
    (async () => {
      const queriedItems = await getDataFromQuery(itemsQuery);
      const newCarouselItems = await Promise.allSettledFiltered(
        queriedItems.map(async (item) =>
          ProductsDisplayCarouselItem.createFrom(item)
        )
      );
      setCarouselItems(newCarouselItems);
    })();
  }, []);

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
          visibility: currRangeStart === 0 ? 'hidden' : 'visible',
        }}
        onClick={() => setcurrRangeStart((oldStart) => oldStart - itemCount)}
      >
        <ChevronLeftIcon />
      </ContainedIconButton>
      <Stack direction="row" spacing={CAROUSEL_SPACING} px={3}>
        {carouselItems
          ? carouselItems
              .slice(currRangeStart, currRangeStart + itemCount)
              .map((item) => <CarouselItem key={item.title} item={item} />)
          : Array.from(Array(itemCount)).map((_, i) => (
              <Skeleton
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                sx={{
                  width: CAROUSEL_ITEM_WIDTH,
                  height: CAROUSEL_ITEM_HEIGHT,
                }}
              />
            ))}
      </Stack>

      <ContainedIconButton
        color="primary"
        sx={{
          position: 'absolute',
          right: 0,
          visibility:
            currRangeStart + itemCount >= carouselItems?.length
              ? 'hidden'
              : 'visible',
        }}
        onClick={() => setcurrRangeStart((oldStart) => oldStart + itemCount)}
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
