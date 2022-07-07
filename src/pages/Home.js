import { Outlet } from 'react-router-dom';
import ImageCarousel from '../components/Homepage/ImageCarousel';
import ProductsDisplayCarousel from '../components/ProductsDisplayCarousel';
import { GameDatabaseQuery } from '../utlis/DBHandlers/DBQueryClasses';

export default function Home() {
  const spotlightItemsQuery = new GameDatabaseQuery('spotlight', '!=', false);
  const offerItemsQuery = new GameDatabaseQuery('discount', '!=', false);

  return (
    <>
      <ImageCarousel itemsQuery={spotlightItemsQuery} />
      <ProductsDisplayCarousel
        title="Today's Offers"
        itemsQuery={offerItemsQuery}
      />
      <Outlet />
    </>
  );
}
