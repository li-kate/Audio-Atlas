import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import streamlit as st

st.markdown(
    """
    <style>
    .stApp {
        background-color: #BFDEBF;  /* Light blue color */
        color: black;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Load merged song data
combined_data = pd.read_csv("C:/Users/Janhavi/PycharmProjects/personal1/combined_songs.csv")

# Drop unnecessary columns (modify if needed)
combined_data = combined_data.drop(columns=["Unnamed: 0"], errors="ignore")

# Function to score user's favorite songs
def score_user_songs(user_songs, combined_data, feature_columns):
    scores = []
    for song_title in user_songs:
        user_song_features = combined_data[combined_data["title"] == song_title][feature_columns]
        if user_song_features.empty:
            st.warning(f"Song not found in dataset: {song_title}")
            continue

        user_song_features = user_song_features.iloc[0].values
        scores.append(user_song_features)

    return np.mean(scores, axis=0) if scores else None

# Function to recommend songs based on audio features
def recommend_songs(user_songs, combined_data, num_recommendations=5):
    recommendations = []
    random_songs = combined_data.sample(n=10000)

    feature_columns = [
        'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
        'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'
    ]
    scaler = StandardScaler()
    random_songs[feature_columns] = scaler.fit_transform(random_songs[feature_columns])

    user_song_scores = score_user_songs(user_songs, combined_data, feature_columns)
    if user_song_scores is None:
        return [], None

    similarities = cosine_similarity(
        [user_song_scores], random_songs[feature_columns].values
    )

    for idx, score in enumerate(similarities[0]):
        similar_song = random_songs.iloc[idx]
        recommendations.append((
            score,
            similar_song["title"],
            similar_song["artist"],
            similar_song["language"],
            similar_song["track_id"],
            similar_song[feature_columns].values
        ))

    recommendations.sort(key=lambda x: x[0], reverse=True)

    english_songs, other_language_songs = [], []
    seen = set()

    for rec in recommendations:
        if rec[1] not in seen:
            seen.add(rec[1])
            if rec[3] == "en" and len(english_songs) < 2:
                english_songs.append(rec)
            elif rec[3] != "en" and len(other_language_songs) < 3:
                other_language_songs.append(rec)
            if len(english_songs) == 2 and len(other_language_songs) == 3:
                break

    return english_songs + other_language_songs, user_song_scores

# Streamlit App
def main():
    st.title("🎵 Song Recommendation System")
    st.write("Select 5 songs from the database to get personalized recommendations.")

    # Prepare song selection with artist names
    combined_data["song_with_artist"] = combined_data["title"] + " - " + combined_data["artist"]
    song_choices = combined_data["song_with_artist"].unique()

    # Allow user to select 5 songs
    selected_songs_with_artists = st.multiselect(
        "secret smile :)",
        song_choices,
        default=None,
        max_selections=5
    )

    selected_songs = [song.split(" - ")[0] for song in selected_songs_with_artists]

    if len(selected_songs) == 5:
        st.write("### Your Selected Songs:")
        for song in selected_songs:
            artist = combined_data[combined_data["title"] == song]["artist"].values[0]
            st.write(f"- **{song}** by **{artist}**")

        st.write("### Generating recommendations...")
        recommended_songs, _ = recommend_songs(selected_songs, combined_data, num_recommendations=5)

        if recommended_songs:
            st.write("### Recommended Songs:")
            for _, title, artist, language, _, _ in recommended_songs:
                st.write(f"- **{title}** by **{artist}** [{language}]")
        else:
            st.warning("No recommendations found. Check if data matches your selected songs.")
    elif len(selected_songs) > 0:
        st.warning("Please select exactly 5 songs.")

if __name__ == "__main__":
    main()