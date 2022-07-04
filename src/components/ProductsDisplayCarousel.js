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
import ContainedIconButton from './ContainedIconButton';
import ExpandingButton from './ExpandingButton';

const CAROUSEL_ITEM_HEIGHT = '250px';
const CAROUSEL_ITEM_WIDTH = '150px';
const CAROUSEL_SPACING = customTheme.spacing(2);

export default function ProductsDisplayCarousel({ title, itemNames }) {
  return (
    <Box sx={{ bgcolor: 'grey.50', m: 2, py: 1, px: 2 }}>
      <Typography variant="h5" as="h3" sx={{ fontWeight: 'bold' }} gutterBottom>
        {title}
      </Typography>
      <Divider />
      <CarouselContainer itemNames={itemNames} />
    </Box>
  );
}

ProductsDisplayCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  itemNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function CarouselContainer({ itemNames }) {
  const [CarouselStackRef, { width: carouselStackWidth }] = useMeasure();
  const itemCount = Math.floor(
    carouselStackWidth / (toPX(CAROUSEL_ITEM_WIDTH) + toPX(CAROUSEL_SPACING))
  );
  const [currRangeStart, setcurrRangeStart] = useState(0);
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
      {itemNames.length ? (
        <Stack direction="row" spacing={CAROUSEL_SPACING} px={3}>
          {itemNames
            .slice(currRangeStart, currRangeStart + itemCount)
            .map((itemName) => (
              <CarouselItem key={itemName} itemName={itemName} />
            ))}
        </Stack>
      ) : (
        <Skeleton sx={{ width: '100%', height: CAROUSEL_ITEM_HEIGHT }} />
      )}

      <ContainedIconButton
        color="primary"
        sx={{
          position: 'absolute',
          right: 0,
          visibility:
            currRangeStart + itemCount >= itemNames.length
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
  itemNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function CarouselItem({ itemName }) {
  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    (async () => {
      const response = await fetch(
        `http://127.0.0.1:5500/pics/${itemName}/boxArt.png`
        // need to change this ^ to firebase link later
      );
      const data = await response.blob();
      const src = URL.createObjectURL(data);
      setImgSrc(src);

      return () => {
        URL.revokeObjectURL(src);
      };
    })();
  }, []);

  const [clicked, setClicked] = useState(false);

  return (
    <Paper sx={{ width: CAROUSEL_ITEM_WIDTH, height: CAROUSEL_ITEM_HEIGHT }}>
      <Link to={`/product/${encodeURIComponent(itemName)}`}>
        {imgSrc ? (
          <Box
            component="img"
            src={imgSrc}
            title={itemName}
            sx={{
              display: 'block',
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              objectPosition: 'top',
              cursor: 'pointer',
            }}
          />
        ) : (
          <Skeleton sx={{ width: '100%', height: '200px' }} />
        )}
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
  itemName: PropTypes.string.isRequired,
};
