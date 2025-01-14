from flask import Flask, request
from .routes import get_routes
from loguru import logger
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.services import TextService, LoginService
from app.services import CodebookService

class App:
    def __init__(self, config  ):
        self.app = Flask(__name__, static_folder="static/react/build", static_url_path="/")
        self.app.config['JWT_SECRET_KEY']= 'super-secret'
        self.app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
        JWTManager(self.app)
        CORS(self.app)
        self.config = config  
        text_service =  TextService()
        login_service = LoginService()  
        codebook_service = CodebookService()    
        self.setup_routes(text_service, login_service, codebook_service)

    def react_serve(self):
        return self.app.send_static_file('index.html')
    def setup_routes(self, text_service, login_service, codebook_service):
        routes = get_routes(text_service, login_service, codebook_service,self.react_serve)
        for route, options in routes.items():
            self.app.add_url_rule(route, view_func=options['function'], methods=options['methods'])
        self.setup_middleware()
        
        @self.app.errorhandler(404)
        def not_Found(e):
            return self.app.send_static_file('index.html')
        

    def setup_middleware(self):
        @self.app.before_request
        def before_request():
            logger.info(f"Handling request for {request.path}")
            # Add your middleware logic here

        @self.app.after_request
        def after_request(response):
            logger.info(f"Finished handling request for {request.path} with status {response.status_code}")
            # Add your middleware logic here
            return response
    

    def run(self):
        self.app.run(debug=True, host=self.config.HOST, port=self.config.PORT)


