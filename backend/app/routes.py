from flask import Flask, jsonify
from flask import request
from loguru import logger
from flask_jwt_extended import jwt_required




def get_routes(text_service, login_service):    
    return {
        '/': {'methods': ['GET'], 'function': lambda: jsonify(message="Welcome to the homepage!")},
        '/login': {'methods': ['POST'], 'function': login_service.login},
        '/text/': {'methods': ['GET'], 'function': jwt_required()(text_service.get_text)},
        '/labels/': {'methods': ['POST'], 'function': jwt_required()(text_service.save_labels)},
        '/folders/': {'methods': ['GET'], 'function': jwt_required()(text_service.get_folders)}
    }
