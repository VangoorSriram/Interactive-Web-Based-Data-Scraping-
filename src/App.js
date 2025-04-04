import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ScraperForm from './components/ScraperForm';
import DashboardMain from './components/Dashboard';
import SuccessRatePage from './components/SuccessRatePage';
import ElementDistributionPage from './components/ElementDistributionPage';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import { SuccessIcon, ElementIcon, ScraperIcon,RegisterIcon,LoginIcon,ChartIcon } from './components/icons';


function App() {
  return (
    <Router>
            <nav className="nav-container">
  <div className="nav-links">
    <div className="nav-group">
      <Link to="/" className="nav-button">
        <ScraperIcon /> Scraper
      </Link>
      <Link to="/dashboard" className="nav-button">
        <ChartIcon /> Main Graph
      </Link>
      <Link to="/success-rate" className="nav-button">
        <SuccessIcon /> Success Rate
      </Link>
      <Link to="/element-distribution" className="nav-button">
        <ElementIcon /> Elements
      </Link>
    </div>
    <div className="nav-group">
      <Link to="/login" className="nav-button">
        <LoginIcon /> Login
      </Link>
      <Link to="/register" className="nav-button">
        <RegisterIcon /> Register
      </Link>
    </div>
  </div>
</nav>

      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ScraperForm />} />
          <Route path="/dashboard" element={<DashboardMain />} />
          <Route path="/success-rate" element={<SuccessRatePage />} />
          <Route path="/element-distribution" element={<ElementDistributionPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
