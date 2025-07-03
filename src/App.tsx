
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import CreatorsPage from './pages/CreatorsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/creators" element={<CreatorsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/create-campaign" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
