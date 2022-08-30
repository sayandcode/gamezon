import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ProductPageMainItemHandler from '../Helpers/ProductPageMainItemHandler';

function PriceDisplay({ productData, currVariant }) {
  const { variants, discountFraction } = productData;
  const priceOfVariant = variants[currVariant].price;
  // if discount is present, we get the discountedPrice, else undefined
  const priceWithDiscount =
    discountFraction && priceOfVariant.multiply(1 - discountFraction);

  return (
    <>
      <Typography variant="h6" display="inline">
        Price:
      </Typography>
      <Typography
        variant="h4"
        color="text.primary"
        fontWeight="bold"
        ml={4}
        gutterBottom
      >
        <Box
          sx={{
            ...(discountFraction && {
              textDecoration: 'line-through',
              textDecorationColor: (theme) => theme.palette.secondary.main,
            }),
            mr: 2,
            position: 'relative',
            display: 'inline-flex',
            justifyContent: 'center',
          }}
        >
          {discountFraction && (
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              color="secondary"
              sx={{ position: 'absolute', top: '-17.5px' }}
            >
              {discountFraction * 100}% OFF
            </Typography>
          )}{' '}
          {priceOfVariant ? priceOfVariant.print() : 'Unreleased'}
        </Box>
        {priceWithDiscount?.print()}
      </Typography>
    </>
  );
}

PriceDisplay.propTypes = {
  productData: PropTypes.instanceOf(ProductPageMainItemHandler).isRequired,
  currVariant: PropTypes.string.isRequired,
};

export default PriceDisplay;
