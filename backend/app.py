
from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper.scraper import scrape_website
from scraper.dynamic_scraper import scrape_dynamic_website
from database import store_scraped_data, fetch_scraped_data
from scheduler import schedule_scraping, scheduler
from auth import configure_auth
from flask_jwt_extended import jwt_required, get_jwt_identity

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
        
        # Get current user if authenticated
        current_user = None
        try:
            current_user = get_jwt_identity()
        except:
            pass  # No token present, continue as guest
        
        scraped_data = scrape_website(urls, element)
        
        # Store data only if authenticated
        if current_user:
            for entry in scraped_data:
                store_scraped_data(
                    url=entry["url"],
                    data=entry["data"],
                    element=entry["element"],
                    user_id=current_user['id']
                )
        
        return jsonify({"success": True, "data": scraped_data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Add auth endpoints
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if register_user(data['username'], data['password']):
        return jsonify({"success": True})
    return jsonify({"success": False, "error": "Registration failed"}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    token = authenticate_user(data['username'], data['password'])
    if token:
        return jsonify({"success": True, "token": token})
    return jsonify({"success": False, "error": "Invalid credentials"}), 401


@app.route("/scrape-dynamic", methods=["POST"])
def scrape_dynamic():
    """Handles JavaScript-rendered webpage scraping."""
    try:
        data = request.json
        url = data.get("url")
        element = data.get("element", "p")
        scraped_data = scrape_dynamic_website(url, element)
        store_scraped_data(url, scraped_data)
        return jsonify({"success": True, "data": scraped_data})
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

@app.route("/data", methods=["GET"])
def get_data():
    """Fetch all scraped data from the database."""
    data = fetch_scraped_data()
    return jsonify({"success": True, "data": data})
@app.route("/scheduled-tasks", methods=["GET"])
def get_scheduled_tasks():
    tasks = scheduler.get_jobs()
    return jsonify({"success": True, "tasks": [{"id": task.id, "url": task.args[0], "interval": task.trigger.interval} for task in tasks]})

if __name__ == "__main__":
    app.run(debug=True)
