import { Box, Paper, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import ErrorMessage from '../../components/ErrorMessage';
import { useResource } from '../../utlis/SuspenseHelpers';
import ProductPageDataHandler from './Helpers/ProductPageDataHandler';
import GenreChips, { GenreChipsFallback } from './Subcomponents/GenreChips';
import ImageViewer, { ImageViewerFallback } from './Subcomponents/ImageViewer';
import ProductDescription from './Subcomponents/ProductDescription';
import VariantsAndPrice, {
  VariantsAndPriceFallback,
} from './Subcomponents/VariantsAndPrice';

function ProductPage() {
  const params = useParams();
  const { productName } = params;

  const productPageDataResource = useResource(getProductPageData, []);

  /* CLEANUP DATA LEAKS */
  // dispose of the data when component is unmounted
  useEffect(() => {
    return () => disposeResource(productPageDataResource);
  }, [productPageDataResource]);

  /* FUNCTION DEFINITIONS */
  function getProductPageData() {
    return ProductPageDataHandler.createFor(productName);
  }

  function disposeResource(resource) {
    resource.promise.then((handler) => handler.dispose());
  }

  return (
    /* All of the suspense components are handled in the same file where the 
    resource is created, i.e here. */
    /* Any component that has a prop *Resource triggers the suspense boundary. 
    This pattern does two things:
      1) Prevents unnecessary prop drilling of resources
      2) Makes it clear which components need suspense boundaries */
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<SuspenseFallback productName={productName} />}>
        <Stack m={2} spacing={2}>
          <Paper
            sx={{
              p: 4,
              display: 'grid',
              gridTemplateColumns: '1.5fr 2fr',
            }}
          >
            <ImageViewer productPageDataResource={productPageDataResource} />
            <Box sx={{ color: (theme) => theme.palette.text.secondary }}>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                color="text.primary"
                gutterBottom
              >
                {productName}
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1} mb={2}>
                <Typography variant="subtitle1">Genre:</Typography>
                <GenreChips productPageDataResource={productPageDataResource} />
              </Stack>
              <VariantsAndPrice
                productPageDataResource={productPageDataResource}
              />
            </Box>
          </Paper>
          <ProductDescription
            productPageDataResource={productPageDataResource}
          />
        </Stack>
      </Suspense>
    </ErrorBoundary>
  );
}

function SuspenseFallback({ productName }) {
  return (
    <Stack m={2} spacing={2}>
      <Paper
        sx={{
          p: 4,
          display: 'grid',
          gridTemplateColumns: '1.5fr 2fr',
        }}
      >
        <ImageViewerFallback />
        <Box sx={{ color: (theme) => theme.palette.text.secondary }}>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            {productName}
          </Typography>
          <Stack direction="row" alignItems="baseline" spacing={1} mb={2}>
            <Typography variant="subtitle1">Genre:</Typography>
            <GenreChipsFallback />
          </Stack>
          <VariantsAndPriceFallback />
        </Box>
      </Paper>
    </Stack>
  );
}

SuspenseFallback.propTypes = {
  productName: PropTypes.string.isRequired,
};

function ErrorFallback() {
  return (
    <Stack
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%)',
      }}
    >
      <ErrorMessage />
    </Stack>
  );
}

export default ProductPage;
