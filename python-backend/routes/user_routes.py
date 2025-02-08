from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os

user_routes = Blueprint("user_routes", __name__)

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["test"]
users_collection = db["users"]

@user_routes.route("/user", methods=["GET"])
def get_user():
    auth0_id = request.args.get("auth0Id")
    if not auth0_id:
        return jsonify({"error": "auth0Id is required"}), 400

    user = users_collection.find_one({"auth0Id": auth0_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user), 200