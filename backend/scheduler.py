from apscheduler.schedulers.background import BackgroundScheduler
from scraper.scraper import scrape_website
from database import store_scraped_data

scheduler = BackgroundScheduler()
scheduler.start()

def scheduled_scrape(url, element='p'):
    scraped_data = scrape_website([url], element)
    for entry in scraped_data:
        store_scraped_data(entry["url"], entry["data"])

def schedule_scraping(url, interval="daily", element="p"):
    if interval == "daily":
        scheduler.add_job(lambda: scheduled_scrape(url, element), "interval", days=1, id=url)
    elif interval == "hourly":
        scheduler.add_job(lambda: scheduled_scrape(url, element), "interval", hours=1, id=url)
    elif interval == "5min":
        scheduler.add_job(lambda: scheduled_scrape(url, element), "interval", minutes=5, id=url)
    elif interval == "10min":
        scheduler.add_job(lambda: scheduled_scrape(url, element), "interval", minutes=10, id=url)
    else:
        return {"success": False, "message": "Invalid interval"}

    return {"success": True, "message": f"Scheduled scraping for {url} every {interval}"}
