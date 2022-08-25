import { Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import PropTypes from 'prop-types';

function ProductVariantsToggleButton({
  variantNames,
  currVariant,
  onChange: handleChange,
}) {
  return (
    <ToggleButtonGroup
      value={currVariant}
      exclusive
      onChange={(_, newVal) => handleChange(newVal)}
      aria-label="text alignment"
      sx={{ mb: 2, display: 'block' }}
    >
      {variantNames.map((variantName) => (
        <ToggleButton value={variantName} key={variantName}>
          {variantName}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

ProductVariantsToggleButton.propTypes = {
  variantNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  currVariant: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

function ProductVariantsToggleButtonFallback() {
  return (
    <Skeleton sx={{ mb: 2 }}>
      <ToggleButton sx={{ width: '500px', display: 'block' }} value="">
        Lorem
      </ToggleButton>
    </Skeleton>
  );
}

export default ProductVariantsToggleButton;
export { ProductVariantsToggleButtonFallback };
