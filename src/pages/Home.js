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
  const cheapGamesQuery = new GameDatabaseQuery().where('price', '<=', 10);
  const ps5GamesQuery = new GameDatabaseQuery().where(
    'consoles',
    'includes',
    'Playstation 5'
  );
  const expensiveGamesQuery = new GameDatabaseQuery().where('price', '>=', 50);
  return (
    <>
      <ImageCarousel items={spotlightItemsQuery} />
      <ProductsDisplayCarousel title="Today's Offers" items={offerItemsQuery} />
      <ProductsDisplayCarousel title="Under $10" items={cheapGamesQuery} />
      <ProductsDisplayCarousel title="Best Of PS5" items={ps5GamesQuery} />
      <ProductsDisplayCarousel title="AAA titles" items={expensiveGamesQuery} />
      <Outlet />
    </>
  );
}
