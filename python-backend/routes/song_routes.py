from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

song_routes = Blueprint("song_routes", __name__)

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["test"]
songs_collection = db["songs"]
users_collection = db["users"]

# Initialize Spotify API client
# Spotify API credentials
client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

# Authenticate with Spotify
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
))

@song_routes.route("/songs", methods=["GET"])
def search_songs():
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    # Search for tracks using Spotify API
    results = sp.search(q=query, type="track", limit=10)
    songs = []

    for track in results["tracks"]["items"]:
        song = {
            "name": track["name"],
            "artist": track["artists"][0]["name"],
            "album": track["album"]["name"],
            "image": track["album"]["images"][0]["url"] if track["album"]["images"] else None,
            "preview_url": track["preview_url"],
            "spotify_id": track["id"]
        }
        songs.append(song)

    return jsonify(songs), 200

@song_routes.route("/user/songs", methods=["POST"])
def save_user_songs():
    data = request.json
    print("Received data:", data)  # Log the incoming data
    auth0_id = data.get("auth0Id")
    songs = data.get("songs")

    if not auth0_id or not songs:
        return jsonify({"error": "Missing required fields"}), 400

    # Update user's favorite songs
    users_collection.update_one(
        {"auth0Id": auth0_id},
        {"$addToSet": {"favoriteSongs": {"$each": songs}}}
    )

    return jsonify({"message": "Songs saved successfully"}), 200

@song_routes.route("/user/songs", methods=["GET"])
def get_user_songs():
    auth0_id = request.args.get("auth0Id")
    if not auth0_id:
        return jsonify({"error": "auth0Id is required"}), 400

    # Find the user in the database
    user = users_collection.find_one({"auth0Id": auth0_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Return the user's saved songs
    saved_songs = user.get("favoriteSongs", [])
    return jsonify(saved_songs), 200

@song_routes.route("/user/songs/remove", methods=["POST"])
def remove_user_songs():
    data = request.json
    auth0_id = data.get("auth0Id")
    song_id = data.get("songId")

    if not auth0_id or not song_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Remove the song from the user's favorite songs
    users_collection.update_one(
        {"auth0Id": auth0_id},
        {"$pull": {"favoriteSongs": {"spotify_id": song_id}}}
    )

    return jsonify({"message": "Song removed successfully"}), 200