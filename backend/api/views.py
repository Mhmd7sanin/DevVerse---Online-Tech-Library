from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson import ObjectId
import json

from .storage import db

books_collection = db["books"]
users_collection = db["users"]


# =====================================
# HELPERS
# =====================================

def generate_book_id():
    """Generate sequential id like b_001, b_002, ... b_999"""
    count = books_collection.count_documents({})
    return "b_{:03d}".format(count + 1)


def serialize_book(book):

    if not book:
        return None

    book["_id"] = str(book["_id"])
    book["id"] = book.get("id", book["_id"])   # prefer custom id (b_001), fall back to _id

    return book


def serialize_user(user):

    if not user:
        return None

    user["_id"] = str(user["_id"])
    user["id"] = user["_id"]   # frontend uses user.id

    # Never expose password
    if "password" in user:
        del user["password"]

    return user


# =====================================
# AUTH
# =====================================

@csrf_exempt
def check_username(request):

    try:

        username = request.GET.get("username")

        exists = users_collection.find_one({
            "username": username
        }) is not None

        return JsonResponse({
            "success": True,
            "exists": exists
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


@csrf_exempt
def users_count(request):

    try:

        count = users_collection.count_documents({})

        return JsonResponse({
            "success": True,
            "count": count
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


@csrf_exempt
def signup(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "POST request required"
        })

    try:

        data = json.loads(request.body)

        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "").strip()

        if not username or not email or not password:
            return JsonResponse({
                "success": False,
                "message": "All fields are required"
            })

        existing_user = users_collection.find_one({
            "username": username
        })

        if existing_user:
            return JsonResponse({
                "success": False,
                "message": "Username already exists"
            })

        new_user = {
            "username": username,
            "email": email,
            "password": password,
            "isAdmin": data.get("isAdmin", False),
            "borrowedBooks": [],
            "createdAt": data.get("createdAt", "")
        }

        result = users_collection.insert_one(new_user)

        created_user = users_collection.find_one({
            "_id": result.inserted_id
        })

        return JsonResponse({
            "success": True,
            "message": "Signup successful",
            "user": serialize_user(created_user)
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


@csrf_exempt
def login(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "POST request required"
        })

    try:

        data = json.loads(request.body)

        username = data.get("username", "").strip()
        password = data.get("password", "").strip()

        user = users_collection.find_one({
            "username": username,
            "password": password
        })

        if not user:
            return JsonResponse({
                "success": False,
                "message": "Invalid username or password"
            })

        return JsonResponse({
            "success": True,
            "message": "Login successful",
            "user": serialize_user(user)
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


# =====================================
# BOOKS
# =====================================

@csrf_exempt
def books(request):

    try:

        # ================= GET =================

        if request.method == "GET":

            books_list = list(books_collection.find())

            serialized_books = [
                serialize_book(book)
                for book in books_list
            ]

            return JsonResponse({
                "success": True,
                "books": serialized_books
            })

        # ================= POST =================

        elif request.method == "POST":

            data = json.loads(request.body)

            new_book = {
                "id": generate_book_id(),   # e.g. "b_001"
                "name": data.get("name", ""),
                "author": data.get("author", ""),
                "category": data.get("category", ""),
                "description": data.get("description", ""),
                "image": data.get("image", ""),
                "isAvailable": True,
                "borrowedBy": None,
                "borrowedAt": None
            }

            result = books_collection.insert_one(new_book)

            created_book = books_collection.find_one({
                "_id": result.inserted_id
            })

            return JsonResponse({
                "success": True,
                "message": "Book added successfully",
                "book": serialize_book(created_book)
            })

        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


@csrf_exempt
def book_detail(request, book_id):

    try:

        book = books_collection.find_one({
            "_id": ObjectId(book_id)
        })

        if not book:
            return JsonResponse({
                "success": False,
                "message": "Book not found"
            })

        # ================= GET =================

        if request.method == "GET":

            return JsonResponse({
                "success": True,
                "book": serialize_book(book)
            })

        # ================= PUT =================

        elif request.method == "PUT":

            data = json.loads(request.body)

            updated_data = {
                "name": data.get("name", book.get("name")),
                "author": data.get("author", book.get("author")),
                "category": data.get("category", book.get("category")),
                "description": data.get("description", book.get("description")),
                "image": data.get("image", book.get("image")),
                "isAvailable": data.get("isAvailable", book.get("isAvailable"))
            }

            books_collection.update_one(
                {"_id": ObjectId(book_id)},
                {"$set": updated_data}
            )

            updated_book = books_collection.find_one({
                "_id": ObjectId(book_id)
            })

            return JsonResponse({
                "success": True,
                "message": "Book updated successfully",
                "book": serialize_book(updated_book)
            })

        # ================= DELETE =================

        elif request.method == "DELETE":

            books_collection.delete_one({
                "_id": ObjectId(book_id)
            })

            return JsonResponse({
                "success": True,
                "message": "Book deleted successfully"
            })

        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


@csrf_exempt
def books_count(request):

    try:

        total_books = books_collection.count_documents({})

        return JsonResponse({
            "success": True,
            "count": total_books
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


# =====================================
# USERS
# =====================================

@csrf_exempt
def users(request):

    try:

        if request.method != "GET":

            return JsonResponse({
                "success": False,
                "message": "GET request required"
            })

        users_list = list(users_collection.find())

        serialized_users = [
            serialize_user(user)
            for user in users_list
        ]

        return JsonResponse({
            "success": True,
            "users": serialized_users
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


@csrf_exempt
def user_detail(request, user_id):

    try:

        user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:

            return JsonResponse({
                "success": False,
                "message": "User not found"
            })

        # ================= GET =================

        if request.method == "GET":

            return JsonResponse({
                "success": True,
                "user": serialize_user(user)
            })

        # ================= PUT =================

        elif request.method == "PUT":

            data = json.loads(request.body)

            updated_data = {
                "username": data.get("username", user.get("username")),
                "email": data.get("email", user.get("email")),
                "isAdmin": data.get("isAdmin", user.get("isAdmin", False))
            }

            # Optional password update
            if "password" in data and data["password"]:
                updated_data["password"] = data["password"]

            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": updated_data}
            )

            updated_user = users_collection.find_one({
                "_id": ObjectId(user_id)
            })

            return JsonResponse({
                "success": True,
                "message": "User updated successfully",
                "user": serialize_user(updated_user)
            })

        # ================= DELETE =================

        elif request.method == "DELETE":

            users_collection.delete_one({
                "_id": ObjectId(user_id)
            })

            return JsonResponse({
                "success": True,
                "message": "User deleted successfully"
            })

        return JsonResponse({
            "success": False,
            "message": "Invalid request method"
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


# =====================================
# BORROW BOOK
# =====================================

@csrf_exempt
def borrow_book(request, book_id):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "POST request required"
        })

    try:

        data = json.loads(request.body)

        user_id = data.get("user_id")   # MongoDB _id string of the user

        if not user_id:

            return JsonResponse({
                "success": False,
                "message": "user_id is required"
            })

        book = books_collection.find_one({
            "_id": ObjectId(book_id)
        })

        if not book:

            return JsonResponse({
                "success": False,
                "message": "Book not found"
            })

        if not book.get("isAvailable", True):

            return JsonResponse({
                "success": False,
                "message": "Book already borrowed"
            })

        user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        if not user:

            return JsonResponse({
                "success": False,
                "message": "User not found"
            })

        borrowed_at = data.get("borrowedAt", "")
        book_custom_id = book.get("id")   # e.g. "b_041"

        # Update book — store user's MongoDB _id as borrowedBy
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {
                "$set": {
                    "isAvailable": False,
                    "borrowedBy": user_id,
                    "borrowedAt": borrowed_at
                }
            }
        )

        # Update user — push object { bookId: "b_041", borrowedAt: "..." }
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$push": {
                    "borrowedBooks": {
                        "bookId": book_custom_id,
                        "borrowedAt": borrowed_at
                    }
                }
            }
        )

        updated_book = books_collection.find_one({
            "_id": ObjectId(book_id)
        })

        updated_user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        return JsonResponse({
            "success": True,
            "message": "Book borrowed successfully",
            "book": serialize_book(updated_book),
            "user": serialize_user(updated_user)
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })


# =====================================
# RETURN BOOK
# =====================================

@csrf_exempt
def return_book(request, book_id):

    if request.method != "POST":

        return JsonResponse({
            "success": False,
            "message": "POST request required"
        })

    try:

        data = json.loads(request.body)

        user_id = data.get("user_id")   # MongoDB _id string of the user

        if not user_id:

            return JsonResponse({
                "success": False,
                "message": "user_id is required"
            })

        book = books_collection.find_one({
            "_id": ObjectId(book_id)
        })

        if not book:

            return JsonResponse({
                "success": False,
                "message": "Book not found"
            })

        book_custom_id = book.get("id")   # e.g. "b_041"

        # Update book
        books_collection.update_one(
            {"_id": ObjectId(book_id)},
            {
                "$set": {
                    "isAvailable": True,
                    "borrowedBy": None,
                    "borrowedAt": None
                }
            }
        )

        # Remove the matching borrowed entry from user by bookId
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$pull": {
                    "borrowedBooks": {
                        "bookId": book_custom_id
                    }
                }
            }
        )

        updated_book = books_collection.find_one({
            "_id": ObjectId(book_id)
        })

        updated_user = users_collection.find_one({
            "_id": ObjectId(user_id)
        })

        return JsonResponse({
            "success": True,
            "message": "Book returned successfully",
            "book": serialize_book(updated_book),
            "user": serialize_user(updated_user)
        })

    except Exception as e:

        return JsonResponse({
            "success": False,
            "message": str(e)
        })