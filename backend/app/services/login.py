from app.models import User
import jwt
import datetime
from flask import request
from flask_jwt_extended import create_access_token
class LoginService:
    def __init__(self):
        self.users = {
            "admin": "admin",
        }
    def get_user(self, username):
        if username in self.users:
            return User(username, self.users[username])
        return None 
    
    def login(self):
        data = request.get_json()
        username = data.get('username').strip()
        password = data.get('password')
        user =  LoginService().get_user(username)
        if user and user.password == password:
            access_token = create_access_token(identity=username, expires_delta=False)
            return {"access_token": access_token}, 200
        else:
            return {"message": "Invalid username or password"}, 401