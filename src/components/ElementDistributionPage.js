import React, { useEffect, useState } from 'react';
import { fetchData } from '../api/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

// Element mapping for tooltips
const elementLabels = {
    'p': 'Paragraph',
    'h1': 'Heading 1',
    'h2': 'Heading 2',
    'img': 'Image',
    'table': 'Table'
    // Add more mappings as needed
};



export default function ElementDistributionPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(response => {
      if (response.data?.success) setData(response.data.data || []);
    });
  }, []);

  const elementCounts = data.reduce((acc, entry) => {
    acc[entry.element] = (acc[entry.element] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(elementCounts).map(key => elementLabels[key] || key),
    datasets: [{
        data: Object.values(elementCounts),
        backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', 
            '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        borderWidth: 1
    }]
};

return (
    <div className="p-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Element Types Distribution</h2>
        <div className="bg-white p-4 rounded-lg shadow" style={{ height: '500px' }}>
            <Doughnut
                data={chartData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                font: {
                                    size: 14
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: ${value} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }}
            />
        </div>
        
        {/* Element Legend */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(elementCounts).map(([element, count]) => (
                <div key={element} className="flex items-center">
                    <div 
                        className="w-4 h-4 rounded-full mr-2" 
                        style={{
                            backgroundColor: chartData.datasets[0].backgroundColor[
                                Object.keys(elementCounts).indexOf(element)
                            ]
                        }}
                    />
                    <span className="text-sm">
                        {elementLabels[element] || element}: {count}
                    </span>
                </div>
            ))}
        </div>
    </div>
);
}