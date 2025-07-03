
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Index from './pages/Index';
import CreatorsPage from './pages/CreatorsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/creators" element={<CreatorsPage />} />
        <Route path="/create-campaign" element={<Index />} />
      </Routes>
    </Router>
  );
}

export default App;
