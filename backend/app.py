from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_website
from dynamic_scraper import scrape_dynamic_website
from scheduler import start_scheduler, schedule_scraping

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return "Backend is running! Use /scrape for static, /scrape-dynamic for JS, and /schedule for automated scraping."

@app.route("/scrape", methods=["POST"])
def scrape():
    """Handles static webpage scraping."""
    try:
        data = request.json
        urls = data.get("urls")
        element = data.get("element", "p")
        scraped_data = scrape_website(urls, element)
        return jsonify({"success": True, "urls": urls, "element": element, "data": scraped_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route("/scrape-dynamic", methods=["POST"])
def scrape_dynamic():
    """Handles JavaScript-rendered webpage scraping."""
    try:
        data = request.json
        url = data.get("url")
        element = data.get("element", "p")
        scraped_data = scrape_dynamic_website(url, element)
        return jsonify({"success": True, "url": url, "element": element, "data": scraped_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route("/schedule", methods=["POST"])
def schedule():
    """Schedule a URL to be scraped periodically."""
    data = request.json
    url = data.get("url")
    interval = data.get("interval", "daily")  # Default: Daily

    schedule_scraping(url, interval)
    return jsonify({"success": True, "message": f"Scheduled {url} every {interval}"})

if __name__ == "__main__":
    start_scheduler()
    app.run(debug=True)
