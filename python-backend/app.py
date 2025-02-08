from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from bson.objectid import ObjectId
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
db = client["test"]
events_collection = db["athensEvents"]
users_collection = db["users"]

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

# Fetch all events
@app.route("/api/events", methods=["GET"])
def get_events():
    events = list(events_collection.find({}))
    # Convert ObjectId to string for JSON serialization
    for event in events:
        event["_id"] = str(event["_id"])
    return jsonify(events)

@app.route("/api/events/attend", methods=["POST"])
def attend_event():
    data = request.json
    print("Received data:", data)  # Log the incoming data

    user_id = data.get("userId")
    event_id = data.get("eventId")

    if not user_id or not event_id:
        print("Missing userId or eventId")  # Log the error
        return jsonify({"error": "Missing userId or eventId"}), 400

    try:
        # Convert eventId to ObjectId
        event_id = ObjectId(event_id)

        # Update the user's document to include the event they are attending
        users_collection.update_one(
            {"auth0Id": user_id},
            {"$addToSet": {"attendingEvents": event_id}}
        )
        print("Event attendance updated successfully")  # Log success
        return jsonify({"message": "Event attendance updated successfully"})
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/events/unattend", methods=["POST"])
def unattend_event():
    data = request.json
    print("Received data:", data)  # Log the incoming data

    user_id = data.get("userId")
    event_id = data.get("eventId")

    if not user_id or not event_id:
        print("Missing userId or eventId")  # Log the error
        return jsonify({"error": "Missing userId or eventId"}), 400

    try:
        # Convert eventId to ObjectId
        event_id = ObjectId(event_id)

        # Remove the event from the user's attendingEvents
        users_collection.update_one(
            {"auth0Id": user_id},
            {"$pull": {"attendingEvents": event_id}}
        )
        print("Event attendance removed successfully")  # Log success
        return jsonify({"message": "Event attendance removed successfully"})
    except Exception as e:
        print("Error:", str(e))  # Log the error
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/user/attending", methods=["GET"])
def get_attending_events():
    user_id = request.args.get("userId")

    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    try:
        # Find the user and return their attendingEvents
        user = users_collection.find_one({"auth0Id": user_id}, {"attendingEvents": 1})
        if user:
            # Convert ObjectId to string for JSON serialization
            attending_events = [str(event_id) for event_id in user.get("attendingEvents", [])]
            return jsonify({"attendingEvents": attending_events})
        else:
            return jsonify({"attendingEvents": []})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/events/recommended", methods=["GET"])
def get_recommended_events():
    user_id = request.args.get("userId")

    if not user_id:
        return jsonify({"error": "Missing userId"}), 400

    try:
        # Find the current user's liked songs
        user = users_collection.find_one({"auth0Id": user_id}, {"favoriteSongs": 1})
        if not user or "favoriteSongs" not in user:
            return jsonify({"recommendedEvents": []})

        user_favorite_songs = set(user["favoriteSongs"])

        # Find other users with similar liked songs
        similar_users = users_collection.find(
            {"favoriteSongs": {"$in": list(user_favorite_songs)}},
            {"attendingEvents": 1}
        )

        # Collect events attended by similar users
        recommended_events = set()
        for similar_user in similar_users:
            if "attendingEvents" in similar_user:
                recommended_events.update(similar_user["attendingEvents"])

        # Exclude events the user is already attending
        if "attendingEvents" in user:
            recommended_events -= set(user["attendingEvents"])

        # Fetch details of recommended events
        recommended_events = list(recommended_events)
        events = events_collection.find({"_id": {"$in": recommended_events}})

        # Convert ObjectId to string for JSON serialization
        events = [{"_id": str(event["_id"]), **event} for event in events]

        return jsonify({"recommendedEvents": events})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Use a different port than Express.js