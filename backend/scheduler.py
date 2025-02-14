from apscheduler.schedulers.background import BackgroundScheduler
from scraper import scrape_website
import logging

scheduler = BackgroundScheduler()

def schedule_scraping(url, interval="daily"):
    """Schedule a URL for periodic scraping."""
    if interval == "daily":
        scheduler.add_job(lambda: scrape_website([url]), "interval", days=1, id=url)
    elif interval == "hourly":
        scheduler.add_job(lambda: scrape_website([url]), "interval", hours=1, id=url)

def start_scheduler():
    """Start the APScheduler."""
    scheduler.start()
    logging.info("Scheduler started.")
