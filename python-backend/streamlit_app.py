import streamlit as st
import requests
from collections import defaultdict
import json

BACKEND_URL = "http://localhost:5001"  # Flask backend

# Fetch user data
def fetch_user_data(auth0_id):
    response = requests.get(f"{BACKEND_URL}/api/user/profile", params={"auth0Id": auth0_id})
    return response.json() if response.status_code == 200 else None

# Fetch all users
def fetch_all_users():
    response = requests.get(f"{BACKEND_URL}/api/users")
    return response.json() if response.status_code == 200 else []

# Fetch all events
def fetch_all_events():
    response = requests.get(f"{BACKEND_URL}/api/events")
    return response.json() if response.status_code == 200 else []

# Recommend events
def recommend_events(user_data, all_users, all_events):
    if not user_data or "favoriteSongs" not in user_data:
        return []

    user_favorite_songs = set(user_data["favoriteSongs"])
    user_attending_events = set(user_data.get("attendingEvents", []))

    similar_users = []
    for user in all_users:
        if user["auth0Id"] != user_data["auth0Id"] and "favoriteSongs" in user:
            common_songs = set(user["favoriteSongs"]) & user_favorite_songs
            if common_songs:
                similar_users.append((user, len(common_songs)))

    similar_users.sort(key=lambda x: x[1], reverse=True)

    recommended_events = defaultdict(int)
    for user, _ in similar_users:
        if "attendingEvents" in user:
            for event_id in user["attendingEvents"]:
                if event_id not in user_attending_events:
                    recommended_events[event_id] += 1

    sorted_events = sorted(recommended_events.items(), key=lambda x: x[1], reverse=True)
    return [event_id for event_id, _ in sorted_events[:5]]

# Fetch ranked attendees
def fetch_attending_users(event_id, all_users, user_data):
    attending_users = [
        {"name": user.get("name", "Unknown"), "commonSongs": len(set(user.get("favoriteSongs", [])) & set(user_data.get("favoriteSongs", [])))}
        for user in all_users if "attendingEvents" in user and event_id in user["attendingEvents"]
    ]
    return sorted(attending_users, key=lambda x: x["commonSongs"], reverse=True)

# Streamlit API response
query_params = st.experimental_get_query_params()
auth0_id = query_params.get("userId", [None])[0]
event_id = query_params.get("eventId", [None])[0]

if auth0_id:
    user_data = fetch_user_data(auth0_id)
    recommended_events = recommend_events(user_data, fetch_all_users(), fetch_all_events())
    st.json({"recommendedEvents": fetch_all_events()})

if event_id:
    attending_users = fetch_attending_users(event_id, fetch_all_users(), fetch_user_data(auth0_id))
    st.json({"attendees": attending_users})