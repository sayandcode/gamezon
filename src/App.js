import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HideOnScroll from './utlis/HideOnScroll';
import ContextProvidersWrapper from './utlis/Contexts/ContextProvidersWrapper';
import ConfirmEmailLogin from './pages/ConfirmEmailLogin';

function App() {
  return (
    <BrowserRouter>
      <ContextProvidersWrapper>
        <HideOnScroll>
          <Navbar />
        </HideOnScroll>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/confirmEmailLogin" element={<ConfirmEmailLogin />} />
          </Route>
          <Route
            path="*"
            element={<h1>Error 404: Page doesn&apos;t exist</h1>}
          />
        </Routes>
        <Footer />
      </ContextProvidersWrapper>
    </BrowserRouter>
  );
}

export default App;
