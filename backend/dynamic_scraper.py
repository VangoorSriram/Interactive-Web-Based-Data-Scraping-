import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

def scrape_dynamic_website(url, element="p"):
    """Scrapes a webpage that requires scrolling."""
    try:
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.get(url)

        for _ in range(5):  
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
            time.sleep(2)

        soup = BeautifulSoup(driver.page_source, "html.parser")
        driver.quit()

        extracted_data = [tag.get_text(strip=True) for tag in soup.find_all(element)][:10]
        return extracted_data

    except Exception as e:
        return []
