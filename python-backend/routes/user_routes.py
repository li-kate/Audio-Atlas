from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

user_routes = Blueprint("user_routes", __name__)

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["test"]
users_collection = db["users"]

# Existing route to fetch user data
@user_routes.route("/user", methods=["GET"])
def get_user():
    auth0_id = request.args.get("auth0Id")
    if not auth0_id:
        return jsonify({"error": "auth0Id is required"}), 400

    user = users_collection.find_one({"auth0Id": auth0_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200

# # New route to fetch user profile data
# @user_routes.route("/user/profile", methods=["GET"])
# def get_profile():
#     auth0_id = request.args.get("auth0Id")
#     if not auth0_id:
#         return jsonify({"error": "auth0Id is required"}), 400

#     try:
#         # Find the user in the database
#         user = users_collection.find_one({"auth0Id": auth0_id})
#         if not user:
#             return jsonify({"error": "User not found"}), 404

#         # Fetch saved songs, attending events, and contact information
#         saved_songs = user.get("favoriteSongs", [])
#         attending_events = user.get("attendingEvents", [])
#         contact = user.get("contact", {})

#         # Prepare profile data
#         profile_data = {
#             "username": user.get("username"),
#             "savedSongs": saved_songs,
#             "attendingEvents": attending_events,
#             "contact": contact  # Include contact information
#         }

#         return jsonify(profile_data), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# # New route to update user contact information
# @user_routes.route("/user/profile/contact", methods=["PUT"])
# def update_contact():
#     auth0_id = request.args.get("auth0Id")
#     if not auth0_id:
#         return jsonify({"error": "auth0Id is required"}), 400

#     try:
#         data = request.json
#         if not data:
#             return jsonify({"error": "No data provided"}), 400

#         # Update contact information
#         users_collection.update_one(
#             {"auth0Id": auth0_id},
#             {"$set": {"contact": data}}
#         )

#         return jsonify({"message": "Contact information updated successfully"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500