import { Outlet } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel/ImageCarousel';
import ProductsDisplayCarousel from '../components/ProductsDisplayCarousel/ProductsDisplayCarousel';
import { GameDatabaseQuery } from '../utlis/DBHandlers/DBQueryClasses';

export default function Home() {
  const spotlightItemsQuery = new GameDatabaseQuery().where(
    'spotlight',
    'exists'
  );
  const offerItemsQuery = new GameDatabaseQuery().where('discount', 'exists');
  return (
    <>
      <ImageCarousel items={spotlightItemsQuery} />
      <ProductsDisplayCarousel title="Today's Offers" items={offerItemsQuery} />
      <Outlet />
    </>
  );
}
