import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import customTheme from './CustomTheme';
import HideOnScroll from './utlis/HideOnScroll';
import { FirebaseContextProvider } from './utlis/FirebaseContext';
import ConfirmEmailLogin from './pages/ConfirmEmailLogin';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={customTheme}>
        <FirebaseContextProvider>
          <CssBaseline />
          <HideOnScroll>
            <Navbar />
          </HideOnScroll>
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
          <Footer />
        </FirebaseContextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
