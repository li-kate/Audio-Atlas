import streamlit as st
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
from sklearn.cluster import KMeans
import numpy as np

# Spotify API credentials
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = "http://localhost:8501"  # Streamlit app URL

# Authenticate with Spotify
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri=SPOTIFY_REDIRECT_URI,
    scope="user-library-read user-library-modify"
))

# Streamlit app
st.title("Discover Diverse Songs")

# Fetch user's saved songs
def get_saved_songs():
    saved_songs = []
    results = sp.current_user_saved_tracks()
    while results:
        saved_songs.extend(results["items"])
        results = sp.next(results)
    return saved_songs

# Get audio features for songs
def get_audio_features(track_ids):
    audio_features = []
    for i in range(0, len(track_ids), 50):  # Spotify API allows 50 IDs per request
        features = sp.audio_features(track_ids[i:i+50])
        audio_features.extend(features)
    return audio_features

# Cluster songs using KMeans (AI-based grouping)
def cluster_songs(audio_features, n_clusters=5):
    features = np.array([[f["danceability"], f["energy"], f["valence"]] for f in audio_features])
    kmeans = KMeans(n_clusters=n_clusters, random_state=42).fit(features)
    return kmeans.labels_

# Generate diverse recommendations
def generate_diverse_recommendations(saved_songs, n_recommendations=20):
    track_ids = [track["track"]["id"] for track in saved_songs]
    audio_features = get_audio_features(track_ids)
    clusters = cluster_songs(audio_features)

    # Get recommendations for each cluster
    recommendations = []
    for cluster in np.unique(clusters):
        seed_tracks = [track_ids[i] for i in range(len(track_ids)) if clusters[i] == cluster][:5]  # Use up to 5 seeds per cluster
        if seed_tracks:
            results = sp.recommendations(seed_tracks=seed_tracks, limit=n_recommendations // len(np.unique(clusters)))
            recommendations.extend(results["tracks"])
    return recommendations

# Save selected songs to user's library
def save_songs(track_ids):
    sp.current_user_saved_tracks_add(tracks=track_ids)

# Main app logic
if st.button("Discover Songs"):
    saved_songs = get_saved_songs()
    if not saved_songs:
        st.error("No saved songs found. Save some songs first!")
    else:
        st.write("Generating diverse song recommendations...")
        recommendations = generate_diverse_recommendations(saved_songs)

        # Display recommended songs
        st.write("### Recommended Songs")
        selected_tracks = []
        for track in recommendations:
            st.write(f"**{track['name']}** by {track['artists'][0]['name']}")
            st.image(track["album"]["images"][0]["url"], width=100)
            if st.button(f"Select {track['name']}", key=track["id"]):
                selected_tracks.append(track["id"])
                st.success(f"Added {track['name']} to selected songs!")

        # Save selected songs
        if selected_tracks:
            if st.button("Save Selected Songs"):
                save_songs(selected_tracks)
                st.success("Selected songs saved to your library!")