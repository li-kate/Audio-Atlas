import streamlit as st
import requests
from collections import defaultdict

# Backend API URL
BACKEND_URL = "http://localhost:5001"  # Replace with your Flask backend URL

# Fetch user data
def fetch_user_data(auth0_id):
    try:
        response = requests.get(f"{BACKEND_URL}/api/user/profile", params={"auth0Id": auth0_id})
        response.raise_for_status()  # Raise an error for bad status codes
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Failed to fetch user data: {e}")
        return None

# Fetch all users
def fetch_all_users():
    try:
        response = requests.get(f"{BACKEND_URL}/api/users")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Failed to fetch users: {e}")
        return []

# Fetch all events
def fetch_all_events():
    try:
        response = requests.get(f"{BACKEND_URL}/api/events")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"Failed to fetch events: {e}")
        return []

# Recommend events based on user's favorite songs and attending events
def recommend_events(user_data, all_users, all_events):
    if not user_data or "favoriteSongs" not in user_data:
        return []

    user_favorite_songs = set(user_data["favoriteSongs"])
    user_attending_events = set(user_data.get("attendingEvents", []))

    # Find users with similar favorite songs
    similar_users = []
    for user in all_users:
        if user["auth0Id"] != user_data["auth0Id"] and "favoriteSongs" in user:
            common_songs = set(user["favoriteSongs"]) & user_favorite_songs
            if common_songs:
                similar_users.append((user, len(common_songs)))

    # Sort similar users by the number of common songs
    similar_users.sort(key=lambda x: x[1], reverse=True)

    # Collect events attended by similar users
    recommended_events = defaultdict(int)
    for user, _ in similar_users:
        if "attendingEvents" in user:
            for event_id in user["attendingEvents"]:
                if event_id not in user_attending_events:
                    recommended_events[event_id] += 1

    # Sort events by recommendation score
    sorted_events = sorted(recommended_events.items(), key=lambda x: x[1], reverse=True)
    return [event_id for event_id, _ in sorted_events[:5]]  # Top 5 recommendations

# Streamlit App
def main():
    st.title('Event Recommendations')

    # Get auth0Id from query parameters
    query_params = st.query_params
    auth0_id = query_params.get("auth0Id", [None])[0]

    if not auth0_id:
        st.warning('Please log in to view recommendations.')
        return

    # Fetch user data
    user_data = fetch_user_data(auth0_id)
    if not user_data:
        return

    # Fetch all users and events
    all_users = fetch_all_users()
    all_events = fetch_all_events()

    # Recommend events
    recommended_event_ids = recommend_events(user_data, all_users, all_events)
    recommended_events = [event for event in all_events if event["_id"] in recommended_event_ids]

    # Display recommended events
    st.header('Recommended Events for You')
    for event in recommended_events:
        st.write(f"**{event['name']}**")
        st.write(f"Location: {event['location']}")
        st.write(f"Date: {event['date']}")
        if st.button(f"See who's going to {event['name']}", key=f"btn_{event['_id']}"):
            attending_users = fetch_attending_users(event['_id'], all_users, user_data)
            st.subheader(f"Users attending {event['name']} (ranked by common saved songs):")
            for user in attending_users:
                st.write(f"- **{user['name']}** ({user['commonSongs']} common songs)")

# Fetch users attending an event, ranked by common saved songs
def fetch_attending_users(event_id, all_users, user_data):
    attending_users = []
    for user in all_users:
        if "attendingEvents" in user and event_id in user["attendingEvents"]:
            common_songs = set(user.get("favoriteSongs", [])) & set(user_data.get("favoriteSongs", []))
            attending_users.append({
                "name": user.get("name", "Unknown User"),
                "commonSongs": len(common_songs)
            })

    # Sort by the number of common songs
    attending_users.sort(key=lambda x: x["commonSongs"], reverse=True)
    return attending_users

if __name__ == '__main__':
    main()