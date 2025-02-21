from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_website
from dynamic_scraper import scrape_dynamic_website
# from scheduler import start_scheduler, schedule_scraping
from database import store_scraped_data, fetch_scraped_data
from scheduler import schedule_scraping, scheduler

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

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

# @app.route('/data', methods=['GET'])
# def get_data():
#     data = fetch_scraped_data()
#     return jsonify({"success": True, "data": data})
    # Dummy data for grouped visualization
@app.route('/data', methods=['GET'])
def get_data():
    # Example grouped data structure
    data = [
        {"url": "https://example1.com", "content": "Some scraped data from site 1", "positive_words": 5, "negative_words": 2},
        {"url": "https://example2.com", "content": "Some scraped data from site 2", "positive_words": 3, "negative_words": 4},
        {"url": "https://example3.com", "content": "Some scraped data from site 3", "positive_words": 6, "negative_words": 1},
    ]
    return jsonify({"success": True, "data": data})

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
    # start_scheduler()
    app.run(debug=True)
