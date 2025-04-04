import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000';

function ScraperForm() {
    const [urls, setUrls] = useState('');
    const [element, setElement] = useState('p');
    const [interval, setInterval] = useState('daily');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/scrape`, 
                { 
                    urls: urls.split(',').map(url => url.trim()), 
                    element 
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );
            setResult(response.data);
        } catch (error) {
            setError(error.response?.data?.error || "Error scraping data. Please try again.");
            console.error("Scraping error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSchedule = async () => {
        if (!urls) return;
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/schedule`,
                {
                    url: urls.split(',')[0].trim(),
                    interval
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );
            alert(response.data.message);
        } catch (error) {
            setError(error.response?.data?.error || "Error scheduling scraping. Please try again.");
            console.error("Scheduling error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Scrape Websites</h2>
            
            {!token && (
                <div className="mb-4 p-4 bg-yellow-100 rounded">
                    <p>You're scraping as a guest. 
                        <button 
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 bg-blue-500 text-white rounded ml-2 hover:bg-blue-600"
                        >
                            Login
                        </button> 
                        to save your history.
                    </p>
                </div>
            )}


            <textarea
                placeholder="Enter URLs (comma-separated)"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                disabled={loading}
            />

            <select
                value={element}
                onChange={(e) => setElement(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                disabled={loading}
            >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="table">Table</option>
                <option value="img">Images</option>
            </select>
            <div className="flex flex-col items-center space-y-4">
            <button
                onClick={handleScrape}
                disabled={loading}
                className="w-full md:w-1/2 p-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
                {loading ? "Scraping..." : "Scrape"}
            </button>

            <h2 className="text-xl font-bold mb-4">Schedule Scraping</h2>
            
            <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                disabled={loading}
            >
                <option value="5min">Every 5 Minutes</option>
                <option value="10min">Every 10 Minutes</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
            </select>

            <button
                onClick={handleSchedule}
                disabled={loading}
                className="w-full md:w-1/2 p-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
                {loading ? "Scheduling..." : "Schedule"}
            </button>
            </div>

            {error && (
                <div className="p-2 mb-4 text-red-600 bg-red-100 rounded">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <h3 className="text-lg font-bold mb-2">Scraped Data</h3>
                    <pre className="overflow-auto max-h-60 p-2 bg-white border rounded">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div></div>
    );
}

export default ScraperForm;
