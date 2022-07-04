import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import SpotlightCarousel from '../components/Homepage/SpotlightCarousel';
import ProductsDisplayCarousel from '../components/ProductsDisplayCarousel';
import { TodaysOffersContext } from '../utlis/Contexts/TodaysOffersContext';

export default function Home() {
  const { offerItems } = useContext(TodaysOffersContext);

  const itemNames = offerItems.map((item) => item.title);
  const discounts = offerItems.map((item) => item.discount);

  return (
    <>
      <SpotlightCarousel items={1} />
      <ProductsDisplayCarousel title="Today's Offers" itemNames={itemNames} />
      <Outlet />
    </>
  );
}
