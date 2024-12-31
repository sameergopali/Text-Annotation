import os

class Config:
    HOST = os.environ.get('HOST') or '127.0.0.1'
    PORT = os.environ.get('PORT') or 8000
    DEBUG = os.environ.get('DEBUG') or True