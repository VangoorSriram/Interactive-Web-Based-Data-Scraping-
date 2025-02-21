import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, Legend, Tooltip } from 'chart.js';

// Register ChartJS components
ChartJS.register(LinearScale, CategoryScale, BarElement, Legend, Tooltip);

function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/data')
            .then(response => {
                if (response.data.success && Array.isArray(response.data.data)) {
                    setData(response.data.data);
                } else {
                    console.error("Invalid data format:", response.data);
                }
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    if (!Array.isArray(data) || data.length === 0) {
        return <div>No data available. Please scrape some data first.</div>;
    }

    // Chart Data for Grouped Bar Chart
    const chartData = {
        labels: data.map(entry => entry.url),
        datasets: [
            {
                label: 'Positive Words',
                data: data.map(entry => entry.positive_words),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Negative Words',
                data: data.map(entry => entry.negative_words),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
        ],
    };

    return (
        <div>
            <h2>Grouped Bar Chart - Positive vs. Negative Words</h2>
            <div className="chart-container">
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: { display: true, text: "Word Count" }
                            },
                            x: {
                                title: { display: true, text: "Scraped URLs" }
                            }
                        },
                        plugins: {
                            legend: { position: 'top' },
                            tooltip: { enabled: true },
                        },
                    }}
                />
            </div>
        </div>
    );
}

export default Dashboard;
