import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import PropTypes from 'prop-types';

function ProductVariantsToggleButton({ value, onChange, variants }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      aria-label="text alignment"
      sx={{ mb: 2, display: 'block' }}
    >
      {variants.map((variantName) => (
        <ToggleButton value={variantName} key={variantName}>
          {variantName}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

ProductVariantsToggleButton.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  variants: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProductVariantsToggleButton;
