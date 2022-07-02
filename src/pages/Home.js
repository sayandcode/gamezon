import {
  AddShoppingCart as AddShoppingCartIcon,
  ReceiptLong as ReceiptLongIcon,
} from '@mui/icons-material';
import { Stack } from '@mui/material';
import { Outlet } from 'react-router-dom';
import SpotlightCarousel from '../components/Homepage/SpotlightCarousel';
import ProductsDisplayCarousel from '../components/ProductsDisplayCarousel';
import ExpandingButton from '../ExpandingButton';

export default function Home() {
  const itemNames = [
    '140',
    "Assassin's Creed Valhalla",
    "Assassin's Creed IV: Black Flag",
    '198X',
  ];

  return (
    <>
      <SpotlightCarousel items={1} />
      <ProductsDisplayCarousel
        title="Today's Offers"
        itemNames={itemNames}
        productButtons={
          <Stack direction="row" justifyContent="flex-start">
            <ExpandingButton
              textContent="Add to Cart"
              icon={<AddShoppingCartIcon />}
              size="large"
            />
            <ExpandingButton
              textContent="Add to Wishlist"
              icon={<ReceiptLongIcon />}
              size="large"
            />
          </Stack>
        }
      />
      <Outlet />
    </>
  );
}
