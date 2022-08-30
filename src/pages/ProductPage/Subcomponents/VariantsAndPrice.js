import { Skeleton, Typography } from '@mui/material';
import { useState } from 'react';
import { resourcePropType } from '../../../utlis/SuspenseHelpers';
import PriceDisplay from './PriceDisplay';
import ProductActionButtons, {
  ProductActionButtonsFallback,
} from './ProductActionButtons';
import ProductVariantsToggleButton, {
  ProductVariantsToggleButtonFallback,
} from './ProductVariantsToggleButton';

function VariantsAndPrice({ productPageDataResource }) {
  const productPageData = productPageDataResource.read();
  const { variants, title: productName } = productPageData.product;
  const variantNames = Object.keys(variants);

  /* COMPONENT STATE */
  const [currVariant, setCurrVariant] = useState(variantNames[0]);

  /* BUTTON STATUS */
  const hasPrice = !!variants[currVariant].price;
  const isButtonsDisabled = !hasPrice;

  return (
    <>
      <ProductVariantsToggleButton
        currVariant={currVariant}
        variantNames={variantNames}
        onChange={(newVariant) =>
          setCurrVariant((oldVariant) => newVariant || oldVariant)
        }
      />
      <PriceDisplay
        productData={productPageData.product}
        currVariant={currVariant}
      />
      <ProductActionButtons
        disabled={isButtonsDisabled}
        currVariant={currVariant}
        productName={productName}
      />
    </>
  );
}

VariantsAndPrice.propTypes = {
  productPageDataResource: resourcePropType.isRequired,
};

function VariantsAndPriceFallback() {
  return (
    <>
      <ProductVariantsToggleButtonFallback />
      <Typography variant="h6" display="inline">
        Price:
      </Typography>
      <Typography
        variant="h4"
        color="text.primary"
        fontWeight="bold"
        ml={4}
        gutterBottom
        width={200}
      >
        <Skeleton />
      </Typography>
      <ProductActionButtonsFallback />
    </>
  );
}

export default VariantsAndPrice;
export { VariantsAndPriceFallback };
