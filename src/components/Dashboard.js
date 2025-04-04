
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Legend, Tooltip } from 'chart.js';
import { fetchData } from '../api/api';
import { Link } from 'react-router-dom';
import { SuccessIcon, ElementIcon, ScraperIcon } from './icons';


ChartJS.register(LinearScale, CategoryScale, BarElement, Legend, Tooltip);

export default function DashboardMain() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScrapedData = async () => {
      setLoading(true);
      try {
        const response = await fetchData();
        if (response.data?.success) {
          setData(response.data.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchScrapedData();
  }, []);

  const chartData = {
    labels: data.map(entry => entry.url.slice(0, 30) + (entry.url.length > 30 ? '...' : '')),
    datasets: [{
      label: 'Content Length',
      data: data.map(entry => entry.content?.length || 0),
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-center">Content Length by URL</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true } }
            }}
            height={400}
          />
        )}
      </div>
      <div className="action-buttons">
    <Link to="/success-rate" className="action-button btn-primary">
        <SuccessIcon /> Success Rate
    </Link>
    <Link to="/element-distribution" className="action-button btn-success">
        <ElementIcon /> Element Distribution
    </Link>
    <Link to="/" className="action-button btn-secondary">
        <ScraperIcon /> Back to Scraper
    </Link>
</div>
    </div>
  );
}
