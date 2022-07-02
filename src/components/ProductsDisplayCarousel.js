import { Box, Divider, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
      <Divider sx={{ mb: 2 }} />
      <Stack direction="row" spacing={2}>
        {itemNames.map((itemName) => (
          <CarouselItem
            key={itemName}
            itemName={itemName}
            productButtons={productButtons}
          />
        ))}
      </Stack>
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
    <Paper sx={{ width: '150px', height: '250px' }}>
      <Link to={`/product/${encodeURIComponent(itemName)}`}>
        <Box
          component="img"
          src={imgSrc}
          sx={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            objectPosition: 'top',
            cursor: 'pointer',
          }}
        />
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
