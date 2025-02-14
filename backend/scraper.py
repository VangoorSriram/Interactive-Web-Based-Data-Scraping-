import asyncio
import aiohttp
from bs4 import BeautifulSoup

async def fetch(url, session):
    """Asynchronously fetch a webpage."""
    async with session.get(url) as response:
        return await response.text()

async def scrape_website_async(urls, element="p"):
    """Scrape multiple webpages asynchronously."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(url, session) for url in urls]
        responses = await asyncio.gather(*tasks)

        results = []
        for url, html in zip(urls, responses):
            soup = BeautifulSoup(html, "html.parser")
            extracted_data = [tag.get_text(strip=True) for tag in soup.find_all(element)][:10]
            results.append({"url": url, "data": extracted_data})

        return results

def scrape_website(urls, element="p"):
    """Wrapper function for async scraping."""
    return asyncio.run(scrape_website_async(urls, element))
