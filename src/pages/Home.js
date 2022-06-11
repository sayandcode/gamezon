import { Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Typography variant="h1">BODY HOME</Typography>
      <Outlet />
    </>
  );
}
