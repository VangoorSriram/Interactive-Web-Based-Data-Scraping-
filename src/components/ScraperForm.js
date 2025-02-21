import React, { useState } from 'react';
import axios from 'axios';

function ScraperForm() {
    const [urls, setUrls] = useState('');
    const [element, setElement] = useState('p');
    const [result, setResult] = useState(null);

    const handleScrape = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/scrape', {
                urls: urls.split(','),
                element,
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error scraping data:", error);
        }
    };

    return (
        <div>
            <h2>Scrape Websites</h2>
            <textarea
                placeholder="Enter URLs (comma-separated)"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
            />
            <select value={element} onChange={(e) => setElement(e.target.value)}>
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
            </select>
            <button onClick={handleScrape}>Scrape</button>
            {result && (
                <div>
                    <h3>Scraped Data</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                    
                </div>
            )}
        </div>
    );
}

export default ScraperForm;