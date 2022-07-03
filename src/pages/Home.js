import {
  AddShoppingCart as AddShoppingCartIcon,
  ReceiptLong as ReceiptLongIcon,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import SpotlightCarousel from '../components/Homepage/SpotlightCarousel';
import ProductsDisplayCarousel from '../components/ProductsDisplayCarousel';
import ExpandingButton from '../ExpandingButton';
import { TodaysOffersContext } from '../utlis/Contexts/TodaysOffersContext';

export default function Home() {
  const { offerItems } = useContext(TodaysOffersContext);

  const itemNames = offerItems.map((item) => item.title);
  const discounts = offerItems.map((item) => item.discount);

  return (
    <>
      <SpotlightCarousel items={1} />
      <ProductsDisplayCarousel
        title="Today's Offers"
        itemNames={itemNames}
        productButtons={
          <Stack direction="row" justifyContent="space-between" p={1}>
            <ExpandingButton
              textContent="Add to Cart"
              icon={<AddShoppingCartIcon />}
              size="large"
              expandDir="right"
            />
            <ExpandingButton
              textContent="Add to Wishlist"
              icon={<ReceiptLongIcon />}
              size="large"
              expandDir="left"
            />
          </Stack>
        }
      />
      <Outlet />
    </>
  );
}
