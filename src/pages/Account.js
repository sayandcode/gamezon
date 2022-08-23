import { Paper, Stack, Typography } from '@mui/material';
import { useContext } from 'react';
import ProductsDisplayCarousel from '../components/ProductsDisplayCarousel/ProductsDisplayCarousel';
import { UserContext } from '../utlis/Contexts/UserData/UserContext';
import AddressSelector from '../components/Address/AddressSelector';

function Account() {
  const { wishlist } = useContext(UserContext);

  return (
    <Stack m={2} spacing={2}>
      <Paper sx={{ p: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
        >
          My Account
        </Typography>
        <AddressSection />
      </Paper>
      <ProductsDisplayCarousel title="Wishlist" items={wishlist.contents} />
    </Stack>
  );
}

export default Account;

function AddressSection() {
  return (
    <div>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography
          variant="h5"
          component="h2"
          color="text.primary"
          display="inline-block"
          gutterBottom
        >
          Addresses
        </Typography>
      </Stack>
      <AddressSelector />
    </div>
  );
}
