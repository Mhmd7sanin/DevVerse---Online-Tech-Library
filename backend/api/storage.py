from pymongo import MongoClient
import uuid

from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")



client = MongoClient(
    MONGODB_URI,
    tls=True,
    tlsAllowInvalidCertificates=True
)

# client.admin.command("ping")

db = client["devverse"]

users_collection = db["users"]
books_collection = db["books"]


def create_user(user_data):

    existing = users_collection.find_one({
        "username": user_data["username"]
    })

    if existing:
        return None

    user_data["id"] = str(uuid.uuid4())

    users_collection.insert_one(user_data)

    return user_data


def login_user(username, password):

    user = users_collection.find_one({
        "username": username,
        "password": password
    })

    if not user:
        return None

    user["_id"] = str(user["_id"])

    return user


def get_user_by_username(username):

    user = users_collection.find_one({
        "username": username
    })

    if user:
        user["_id"] = str(user["_id"])

    return user


def get_all_books():

    books = list(books_collection.find())

    for book in books:
        book["_id"] = str(book["_id"])

    return books