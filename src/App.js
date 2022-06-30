import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ContextProvidersWrapper from './utlis/Contexts/ContextProvidersWrapper';
import ConfirmEmailLogin from './pages/ConfirmEmailLogin';
import NotificationSnackbar from './components/NotificationSnackbar';

function App() {
  return (
    <BrowserRouter>
      <ContextProvidersWrapper>
        <Box
          sx={{
            minHeight: '100vh',
            position: 'relative',
          }}
        >
          <Navbar />
          <NotificationSnackbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />}>
                <Route
                  path="/confirmEmailLogin"
                  element={<ConfirmEmailLogin />}
                />
              </Route>
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
      </ContextProvidersWrapper>
    </BrowserRouter>
  );
}

export default App;
