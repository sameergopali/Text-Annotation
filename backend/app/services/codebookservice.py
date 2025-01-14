from pathlib import Path
from flask import request
import json
from loguru import logger
class CodebookService:
    def __init__(self):
        self.base_path = Path(__file__).parent.parent / 'data'/ 'codebook'
        
    def get_codebook(self):
        fname = request.args.get('filename')
        if not fname:
            return {"error": "fname parameter is missing"}, 400
        try:
            with open(self.base_path / f'{fname}.json', 'r') as file:
                codebook = json.load(file)
                logger.info(f"Getting Codebook: {codebook}")
                return {"codebook": codebook}, 200  
            return codebook, 200
        except FileNotFoundError:
            return {"error": "Not found "},200
        except json.JSONDecodeError:
            return {"error": "Error decoding JSON"}, 500
        
    
    def save_codebook(self):
        data = request.get_json()   
        fname = data.get('filename')
        codebook  = data.get('codebook')
        logger.info(f"Codebook: {codebook}")    
        if not fname:
            return {"error": "fname parameter is missing"}, 400
        try:
            with open(self.base_path /f'{fname}.json', 'w') as file:
                json.dump(codebook, file)
            return {"message": "Codebook saved"}, 200
        except Exception as e:
            return {"error": str(e)}, 500
        
        