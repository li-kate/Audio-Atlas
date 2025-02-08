import streamlit as st
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import os
from dotenv import load_dotenv
import pymongo
import random
import numpy as np
from sklearn.cluster import KMeans

load_dotenv()

# Spotify API credentials
client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")

# Authenticate with Spotify (no user login required)
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id=client_id,
    client_secret=client_secret
))

# MongoDB 
mongo_uri = os.getenv("MONGO_URI")
client = pymongo.MongoClient(mongo_uri)
db = client["test"]
users_collection = db["users"]

# Streamlit app
st.title("Discover Diverse Songs in Different Languages")

# Fetch saved songs from MongoDB database for a specific user
def get_saved_songs_from_db(auth0_id):
    user = users_collection.find_one({"auth0Id": auth0_id})
    if user and "favoriteSongs" in user:
        return user["favoriteSongs"]  # Assuming favoriteSongs contains track IDs
    return []

# Get audio features for songs
def get_audio_features(track_ids):
    audio_features = []
    for i in range(0, len(track_ids), 50):  # Spotify API allows 50 IDs per request
        features = sp.audio_features(track_ids[i:i+50])
        audio_features.extend(features)
    return audio_features

# Cluster songs based on audio features
def cluster_songs(audio_features, n_clusters=5):
    features = np.array([[f["danceability"], f["energy"], f["valence"]] for f in audio_features])
    kmeans = KMeans(n_clusters=n_clusters, random_state=42).fit(features)
    return kmeans.labels_

# Get the language of a track by analyzing the artist's country or metadata
def get_track_language(track):
    artist_country = track["artists"][0]["country"] if "country" in track["artists"][0] else "unknown"
    return artist_country

# Generate diverse recommendations based on saved songs, ensuring language diversity
def generate_diverse_recommendations(saved_songs, n_recommendations=20):
    track_ids = [song["spotify_id"] for song in saved_songs if "spotify_id" in song]
    audio_features = get_audio_features(track_ids)
    clusters = cluster_songs(audio_features)

    # Create a dictionary to store unique languages
    language_dict = {}
    recommendations = []

    # Generate recommendations for each cluster
    for cluster in np.unique(clusters):
        # Get the saved songs in this cluster
        seed_tracks = [track_ids[i] for i in range(len(track_ids)) if clusters[i] == cluster]

        # Recommend songs for this cluster
        results = sp.recommendations(seed_tracks=seed_tracks, limit=n_recommendations // len(np.unique(clusters)))
        for track in results['tracks']:
            track_language = get_track_language(track)

            # Only select recommendations from languages that haven't been chosen yet
            if track_language not in language_dict:
                recommendations.append(track)
                language_dict[track_language] = True

            # Stop if we have enough recommendations
            if len(recommendations) >= n_recommendations:
                break
        
        # Stop if we have enough recommendations
        if len(recommendations) >= n_recommendations:
            break
    
    return recommendations

# Save selected songs to user's library (only in the Streamlit interface, not Spotify)
def save_songs(auth0_id, track_ids):
    # Update the user's favoriteSongs in MongoDB
    users_collection.update_one(
        {"auth0Id": auth0_id},
        {"$addToSet": {"favoriteSongs": {"$each": track_ids}}}
    )
    st.success(f"Saved {len(track_ids)} songs to your library!")

# Main app logic
auth0_id = st.text_input("Enter your Auth0 ID:")  # Allow user to input their Auth0 ID

if st.button("Discover Diverse Songs in Different Languages"):
    if not auth0_id:
        st.error("Please enter your Auth0 ID.")
    else:
        saved_songs = get_saved_songs_from_db(auth0_id)
        if not saved_songs:
            st.error("No saved songs found in database. Add some songs first!")
        else:
            st.write("Generating diverse song recommendations...")

            recommendations = generate_diverse_recommendations(saved_songs)

            # Display recommended songs
            st.write("### Recommended Diverse Songs")
            selected_tracks = []
            for track in recommendations:
                st.write(f"**{track['name']}** by {track['artists'][0]['name']}")
                st.image(track["album"]["images"][0]["url"], width=100)
                if st.button(f"Select {track['name']}", key=track["id"]):
                    selected_tracks.append(track["id"])
                    st.success(f"Added {track['name']} to selected songs!")

            # Save selected songs to MongoDB
            if selected_tracks:
                if st.button("Save Selected Songs"):
                    save_songs(auth0_id, selected_tracks)