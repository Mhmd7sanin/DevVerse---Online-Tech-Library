"""
DevVerse — api/urls.py
All API routes. Each URL maps to a view in views.py.
"""

from django.urls import path
from . import views

urlpatterns = [

    # AUTH
    path("auth/signup/", views.signup),
    path("auth/login/", views.login),
    path("users/check-username/", views.check_username),

    # BOOKS
    path("books/", views.books),
    path("books/count/", views.books_count),
    path("books/<str:book_id>/", views.book_detail),
    path("books/<str:book_id>/borrow/", views.borrow_book),
    path("books/<str:book_id>/return/", views.return_book),

    # USERS
    path("users/", views.users),
    path("users/create/", views.create_user),
    path("users/count/", views.users_count),
    path("users/<str:user_id>/", views.user_detail),
]