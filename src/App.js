import { Routes, Route, HashRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ContextProvidersWrapper from './utlis/Contexts/ContextProvidersWrapper';
import ConfirmEmailLogin from './pages/ConfirmEmailLogin';
import ProductPage from './pages/ProductPage/ProductPage';
import PersistentComponents from './components/PersistentComponents';
import Cart from './pages/CartPage/CartPage';
import Account from './pages/Account';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import RedirectIfNotLoggedIn from './utlis/RedirectIfNotLoggedIn';
import OrdersPage from './pages/OrdersPage/OrdersPage';

function App() {
  return (
    <HashRouter>
      <ContextProvidersWrapper>
        <Box
          as="h1"
          sx={{
            display: { xs: 'flex', md: 'none' },
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontSize: '1rem',
            px: 1,
            textAlign: 'center',
          }}
        >
          This website is not intended to be used on mobile
        </Box>
        <Box
          sx={{
            display: {
              xs: 'none',
              md: 'block',
            },
          }}
        >
          <Box
            sx={{
              minHeight: '100vh',
              position: 'relative',
            }}
          >
            <Navbar />
            <PersistentComponents />
            <main>
              <Routes>
                <Route path="/" element={<Home />}>
                  <Route
                    path="/confirmEmailLogin"
                    element={<ConfirmEmailLogin />}
                  />
                </Route>
                <Route path="/product/:productName" element={<ProductPage />} />
                <Route
                  path="/cart"
                  element={
                    <RedirectIfNotLoggedIn>
                      <Cart />
                    </RedirectIfNotLoggedIn>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <RedirectIfNotLoggedIn>
                      <Account />
                    </RedirectIfNotLoggedIn>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <RedirectIfNotLoggedIn>
                      <CheckoutPage />
                    </RedirectIfNotLoggedIn>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <RedirectIfNotLoggedIn>
                      <OrdersPage />
                    </RedirectIfNotLoggedIn>
                  }
                />
                <Route
                  path="*"
                  element={<h1>Error 404: Page doesn&apos;t exist</h1>}
                />
              </Routes>
            </main>
            <footer
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                transform: 'translateY(100%)',
              }}
            >
              <Footer />
            </footer>
          </Box>
        </Box>
      </ContextProvidersWrapper>
    </HashRouter>
  );
}

export default App;
