import requests
from bs4 import BeautifulSoup

def scrape_website(url, element="p"):
    """Scrapes a static webpage and extracts data based on the provided element."""
    try:
        response = requests.get(url, timeout=5)  # Fetch webpage
        response.raise_for_status()  # Raise error for HTTP failures
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract text content
        if element == "img":
            extracted_data = [img["src"] for img in soup.find_all("img") if "src" in img.attrs][:10]
        elif element == "table":
            tables = soup.find_all("table")[:1]  # Extract first table
            extracted_data = [str(table) for table in tables]  # Convert tables to HTML
        else:
            extracted_data = [tag.get_text(strip=True) for tag in soup.find_all(element)][:10]

        return extracted_data

    except Exception as e:
        return {"error": str(e)}
