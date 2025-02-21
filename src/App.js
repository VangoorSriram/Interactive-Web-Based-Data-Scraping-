import React, { useState } from "react";
import ScraperForm from "./components/ScraperForm"; // Ensure correct path
import Dashboard from "./components/Dashboard"; // Ensure correct path
import "./App.css";
import App from "./App"



function App() {
  const [results, setResults] = useState([]);
  console.log("App.js rendering...");
  console.log("ScraperForm:", ScraperForm);
  console.log("Dashboard:", Dashboard);
  return (
    <div>
      <h1>Web Scraper Application</h1>
      <ScraperForm onScrape={(data) => console.log("Scraped Data:", data)} />
      <Dashboard /> 
    </div>
  );
}

export default App;
