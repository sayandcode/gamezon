import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import HideOnScroll from './components/HideOnScroll';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <>
      <HideOnScroll>
        <Navbar />
      </HideOnScroll>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
