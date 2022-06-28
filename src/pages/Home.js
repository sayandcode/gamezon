import { Outlet } from 'react-router-dom';
import SpotlightCarousel from '../components/Homepage/SpotlightCarousel';

export default function Home() {
  return (
    <>
      <SpotlightCarousel items={1} />
      <Outlet />
    </>
  );
}
