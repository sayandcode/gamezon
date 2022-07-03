import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContainedIconButton from './ContainedIconButton';

const CAROUSEL_ITEM_HEIGHT = '250px';
const CAROUSEL_ITEM_COUNT = 6;

export default function ProductsDisplayCarousel({
  title,
  itemNames,
  productButtons,
}) {
  return (
    <Box sx={{ bgcolor: 'grey.50', m: 2, py: 1, px: 2 }}>
      <Typography variant="h5" as="h3" sx={{ fontWeight: 'bold' }} gutterBottom>
        {title}
      </Typography>
      <Divider />
      <CarouselContainer
        itemNames={itemNames}
        productButtons={productButtons}
      />
    </Box>
  );
}

ProductsDisplayCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  itemNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  productButtons: PropTypes.node,
};

ProductsDisplayCarousel.defaultProps = {
  productButtons: null,
};

function CarouselContainer({ itemNames, productButtons }) {
  const [currRangeStart, setcurrRangeStart] = useState(0);
  return (
    <Stack direction="row" my={2} position="relative" alignItems="center">
      <ContainedIconButton
        color="primary"
        sx={{
          position: 'absolute',
          left: 0,
          visibility: currRangeStart === 0 ? 'hidden' : 'visible',
        }}
        onClick={() =>
          setcurrRangeStart((oldStart) => oldStart - CAROUSEL_ITEM_COUNT)
        }
      >
        <ChevronLeftIcon />
      </ContainedIconButton>
      {itemNames.length ? (
        <Stack direction="row" spacing={2} px={3}>
          {itemNames
            .slice(currRangeStart, currRangeStart + CAROUSEL_ITEM_COUNT)
            .map((itemName) => (
              <CarouselItem
                key={itemName}
                itemName={itemName}
                productButtons={productButtons}
              />
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
            currRangeStart + CAROUSEL_ITEM_COUNT >= itemNames.length
              ? 'hidden'
              : 'visible',
        }}
        onClick={() =>
          setcurrRangeStart((oldStart) => oldStart + CAROUSEL_ITEM_COUNT)
        }
      >
        <ChevronRightIcon />
      </ContainedIconButton>
    </Stack>
  );
}

CarouselContainer.propTypes = {
  itemNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  productButtons: PropTypes.node,
};

CarouselContainer.defaultProps = {
  productButtons: null,
};

function CarouselItem({ itemName, productButtons }) {
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

  return (
    <Paper sx={{ width: '150px', height: CAROUSEL_ITEM_HEIGHT }}>
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
      {productButtons}
    </Paper>
  );
}

CarouselItem.propTypes = {
  itemName: PropTypes.string.isRequired,
  productButtons: PropTypes.node,
};

CarouselItem.defaultProps = {
  productButtons: null,
};
