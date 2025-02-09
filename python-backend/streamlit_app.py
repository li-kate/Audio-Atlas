import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import streamlit as st

# MongoDB Atlas Connection
MONGO_URI = "mongodb+srv://kli605:UT5EOcqJHiObp5Dp@firstcluster.2a3mg.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["test"]  # Replace with actual database name
users_collection = db["users"]  # Collection storing users and saved songs

# Load merged song data
combined_data = pd.read_csv("C:/Users/Janhavi/PycharmProjects/personal1/combined_songs.csv")

# Drop unnecessary columns (modify if needed)
combined_data = combined_data.drop(columns=["Unnamed: 0"], errors="ignore")

# Function to get user-saved songs from MongoDB
def get_saved_songs_from_db(auth0_id):
    user = users_collection.find_one({"auth0Id": auth0_id})
    if user:
        if "favoriteSongs" in user:
            return user["favoriteSongs"]  # Assuming favoriteSongs contains track titles
    return []

# Function to score user's favorite songs
def score_user_songs(user_songs, combined_data, feature_columns):
    scores = []
    for song in user_songs:
        song_title = song.get("name")  # Use "name" or "title"
        if not song_title:
            continue

        # Find the audio features of the user's liked song
        user_song_features = combined_data[combined_data["title"] == song_title][feature_columns]
        if user_song_features.empty:
            continue  # Skip if the song is not found in the dataset

        user_song_features = user_song_features.iloc[0].values
        scores.append(user_song_features)

    if scores:
        return np.mean(scores, axis=0)  # Return average feature scores
    else:
        return None

# Function to recommend songs based on audio features
def recommend_songs(user_songs, combined_data, num_recommendations=5):
    recommendations = []  # Store recommendations as a list of tuples (score, song details)

    # Sample 10000 random songs from the combined_data (no fixed random state)
    random_songs = combined_data.sample(n=10000)

    # Normalize the additional features
    feature_columns = [
        'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
        'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'
    ]
    scaler = StandardScaler()
    random_songs[feature_columns] = scaler.fit_transform(random_songs[feature_columns])

    # Score user's favorite songs
    user_song_scores = score_user_songs(user_songs, combined_data, feature_columns)

    if user_song_scores is None:
        return [], None  # Return empty list if no user song scores are available

    # Calculate cosine similarity between the user's average scores and all candidate songs
    similarities = cosine_similarity(
        [user_song_scores], random_songs[feature_columns].values
    )

    # Add candidate songs to recommendations with their similarity scores
    for idx, score in enumerate(similarities[0]):
        similar_song = random_songs.iloc[idx]
        recommendations.append((
            score,
            similar_song["title"],
            similar_song["artist"],
            similar_song["language"],
            similar_song["track_id"],
            similar_song[feature_columns].values  # Get the features of the recommended song
        ))

    # Sort recommendations by similarity score (highest first)
    recommendations.sort(key=lambda x: x[0], reverse=True)

    # Filter recommendations to include 3 songs in different languages and 2 in English
    unique_recommendations = []
    english_songs = []
    other_language_songs = []
    seen = set()

    for rec in recommendations:
        if rec[1] not in seen:  # Check if the song title is already in the recommendations
            seen.add(rec[1])
            if rec[3] == "en" and len(english_songs) < 2:
                english_songs.append(rec)
            elif rec[3] != "en" and len(other_language_songs) < 3:
                other_language_songs.append(rec)
            if len(english_songs) == 2 and len(other_language_songs) == 3:
                break

    unique_recommendations = english_songs + other_language_songs
    return unique_recommendations, user_song_scores

# Streamlit App
def main():
    st.title("🎵 Song Recommendation System")
    st.write("Enter your Auth0 ID to get personalized song recommendations.")

    # Input for Auth0 ID
    auth0_id = st.text_input("Enter your Auth0 ID:")

    if auth0_id:
        st.write(f"Fetching recommendations for user: {auth0_id}")

        # Get user's saved songs
        user_songs = get_saved_songs_from_db(auth0_id)
        if not user_songs:
            st.warning("No saved songs found for this user.")
        else:
            st.write("### Your Saved Songs:")
            for song in user_songs:
                st.write(f"- {song.get('name')} ({song.get('language', 'Unknown')})")

            # Generate recommendations
            st.write("### Generating recommendations based on audio features...")
            recommended_songs, _ = recommend_songs(user_songs, combined_data, num_recommendations=5)

            if recommended_songs:
                st.write("### Recommended Songs:")
                for _, title, artist, language, _, _ in recommended_songs:
                    st.write(f"- **{title}** by {artist} [{language}]")
            else:
                st.warning("No recommendations found. Check if data matches user's saved songs.")

# Run the Streamlit app
if __name__ == "__main__":
    main()