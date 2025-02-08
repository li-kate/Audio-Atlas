from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise ValueError("MONGO_URI is not defined in .env file")

client = MongoClient(mongo_uri)
db = client["tinder_clone"]

# Import routes
from routes.song_routes import song_routes
from routes.user_routes import user_routes

# Register routes
app.register_blueprint(song_routes, url_prefix="/api")
app.register_blueprint(user_routes, url_prefix="/api")

# Root endpoint
@app.route("/")
def home():
    return "Welcome to the Python Backend!"

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Use a different port than Express.js