
from flask import Flask, request, jsonify
from flask_cors import CORS
from scraper import scrape_website  # Import Scraper Function

app = Flask(__name__)
CORS(app)  # Enable CORS for Frontend Communication

@app.route("/", methods=["GET"])
def home():
    return "Backend is running! Use /scrape to fetch data."

@app.route("/scrape", methods=["POST"])
def scrape():
    try:
        data = request.json
        url = data.get("url")
        element = data.get("element", "p")  # Default to paragraph

        scraped_data = scrape_website(url, element)
        return jsonify({"success": True, "url": url, "element": element, "data": scraped_data})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
