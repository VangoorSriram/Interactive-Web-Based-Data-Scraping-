import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from react-dom/client
import ScraperForm from './components/ScraperForm';
import Dashboard from './components/Dashboard';
import "./App.css";

function App() {
    return (
        <div>
            <h1>Web Scraper</h1>
            <ScraperForm />
            <Dashboard />
        </div>
    );
}

// Use createRoot instead of ReactDOM.render()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
