import PropTypes from 'prop-types';
import { Button, Stack } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../../utlis/Contexts/UserData/UserContext';
import Cart from '../../../utlis/Contexts/UserData/UserDataHelperClasses/Cart';
import CounterButtons from '../../../components/CounterButtons';

function ProductActionButtons({ disabled, currVariant, productName }) {
  /* SHOW DIFFERENT SCREENS DEPENDING ON WHETHER PRODUCT IS ALREADY IN CART OR NOT */
  const { cart, wishlist, checkout } = useContext(UserContext);
  const productAlreadyInCart = cart.find(productName, currVariant);
  const productAlreadyInWishlist = wishlist.find(productName, currVariant);

  /* EVENT HANDLERS */
  const handleCheckout = () => {
    const cartWithOnlyThisProduct = new Cart().add(productName, currVariant);
    checkout(cartWithOnlyThisProduct);
  };
  return (
    <Stack spacing={2} direction="row">
      <BigContainedButton
        color="secondary"
        disabled={disabled}
        onClick={handleCheckout}
      >
        Buy Now
      </BigContainedButton>
      {productAlreadyInCart ? (
        <CounterButtons
          label="No in cart"
          count={productAlreadyInCart.count}
          onClick={{
            minus: () => cart.remove(productName, currVariant),
            plus: () => cart.add(productName, currVariant),
          }}
        />
      ) : (
        <BigContainedButton
          disabled={disabled}
          color="primary"
          onClick={() => cart.add(productName, currVariant)}
        >
          Add to cart
        </BigContainedButton>
      )}

      <BigOutlinedButton
        color="primary"
        onClick={() => wishlist.toggle(productName)}
      >
        {productAlreadyInWishlist ? 'Remove from ' : 'Add to '}Wishlist
      </BigOutlinedButton>
    </Stack>
  );
}

ProductActionButtons.propTypes = {
  currVariant: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

function ProductActionButtonsFallback() {
  return (
    <Stack spacing={2} direction="row">
      <BigContainedButton color="secondary" disabled>
        Buy Now
      </BigContainedButton>
      <BigContainedButton disabled color="primary">
        Add to cart
      </BigContainedButton>
      <BigOutlinedButton disabled color="primary">
        Add to Wishlist
      </BigOutlinedButton>
    </Stack>
  );
}

function BigButton(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Button {...props} size="large" />;
}

function BigContainedButton(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BigButton {...props} variant="contained" />;
}

function BigOutlinedButton(props) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BigButton {...props} variant="outlined" />;
}

export default ProductActionButtons;
export { ProductActionButtonsFallback };
