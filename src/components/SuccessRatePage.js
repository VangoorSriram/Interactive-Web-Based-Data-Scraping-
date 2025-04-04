
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { fetchData } from '../api/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SuccessRatePage() {
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

  // Improved success/failure calculation
  const successCount = data.filter(entry => 
    entry.content && entry.content.length > 0 && 
    (entry.status === 'success' || !entry.status)
  ).length;

  const failedCount = data.length - successCount;
  const successRate = data.length > 0 ? Math.round((successCount / data.length) * 100) : 0;

  const chartData = {
    labels: ['Successful', 'Failed'],
    datasets: [{
      data: [successCount, failedCount],
      backgroundColor: ['#10B981', '#EF4444'],
      borderColor: ['#059669', '#DC2626'],
      borderWidth: 1
    }]
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Scraping Success Rate</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : data.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 h-64 md:h-80">
              <Pie 
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800">Successful Scrapes</h3>
                <p className="text-2xl font-bold text-green-600">{successCount}</p>
                <p className="text-green-700">{successRate}% success rate</p>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800">Failed Scrapes</h3>
                <p className="text-2xl font-bold text-red-600">{failedCount}</p>
                <p className="text-red-700">{100 - successRate}% failure rate</p>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800">Total Scrapes</h3>
                <p className="text-2xl font-bold text-blue-600">{data.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No data available</div>
        )}
      </div>
    </div>
  );
}