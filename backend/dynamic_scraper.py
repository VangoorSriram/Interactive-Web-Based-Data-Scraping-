from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time

def scrape_dynamic_website(url, element="p"):
    """Scrapes JavaScript-rendered pages using Selenium."""
    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode (no browser UI)
        chrome_options.add_argument("--disable-gpu")

        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.get(url)

        # Wait for JavaScript elements to load
        time.sleep(5)

        # Extract the full page source after JavaScript execution
        page_source = driver.page_source
        driver.quit()

        soup = BeautifulSoup(page_source, "html.parser")

        extracted_data = [tag.get_text(strip=True) for tag in soup.find_all(element)][:10]

        return extracted_data

    except Exception as e:
        return {"error": str(e)}
