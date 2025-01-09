from flask import Flask, jsonify, send_from_directory
from flask import request
from loguru import logger
from flask_jwt_extended import jwt_required





def get_routes(text_service, login_service, serve_react):    
    return {
        '/': {'methods': ['GET'], 'function': serve_react  },
        '/login': {'methods': ['POST'], 'function': login_service.login},
        '/text/': {'methods': ['GET'], 'function': jwt_required()(text_service.get_text)},
        '/labels': {'methods': ['POST'], 'function': jwt_required()(text_service.save_labels)},
        '/folders/': {'methods': ['GET'], 'function': jwt_required()(text_service.get_folders)},
        '/labels/': {'methods': ['GET'], 'function': jwt_required()(text_service.get_labels)},
        '/users/': {'methods': ['GET'], 'function': jwt_required()(text_service.get_user)}
    }
