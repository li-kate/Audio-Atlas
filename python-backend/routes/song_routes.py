from flask import Blueprint, request, jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os

song_routes = Blueprint("song_routes", __name__)

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