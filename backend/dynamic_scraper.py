from selenium.webdriver.common.keys import Keys

def scrape_dynamic_website(url, element="p"):
    """Scrapes a webpage that requires scrolling."""
    try:
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.get(url)

        # Scroll multiple times to load more content
        for _ in range(5):
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
            time.sleep(2)

        page_source = driver.page_source
        driver.quit()

        soup = BeautifulSoup(page_source, "html.parser")
        extracted_data = [tag.get_text(strip=True) for tag in soup.find_all(element)][:10]

        return extracted_data

    except Exception as e:
        return {"error": str(e)}
