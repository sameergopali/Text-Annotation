from pathlib import Path    
from loguru import logger   
from flask import request
from flask_jwt_extended import get_jwt_identity
import json

class TextService:
    def __init__(self):
        self.save_dir = Path(__file__).parent.parent / 'data'/'txt_files'
        self.text_files = sorted(list(self.save_dir.glob('*.txt')))
        logger.info(f"Text files: {self.text_files}")
        logger.info(f"Text files: {self.text_files}")

        
    def get_labels(self, username, curr):
        save_dir = Path(__file__).parent.parent / 'data'/'labels' / f"{username}"
        filename = save_dir / f"{self.text_files[curr].stem}.json"
        if filename.exists():
            with open(filename, 'r') as file:
                return json.load(file)
        return []
        
    def get_text(self,curr):
        username = get_jwt_identity()  
        logger.info(f"username: {username}")
        curr = int(curr)
        labels  = self.get_labels(username,curr)
        
        if int(curr) >= len(self.text_files):
            return {"text": "No more text files", "curr": curr}
        file_path = self.text_files[curr]
        logger.info(f"Reading file: {file_path}")
        with open(file_path, 'r') as file:
            text = file.read()
        
        return {"text": text, "curr": curr, "labels":labels, "total": len(self.text_files)}
    
    def save_labels(self):
        username = get_jwt_identity()   
        logger.info(f"username: {username}")
        data = request.get_json()
        curr  = int(data.get('curr'))
        labels = data.get('labels')
        logger.info(f"Data: {data}")
       
        save_dir = Path(__file__).parent.parent / 'data'/'labels' / f"{username}"
        save_dir.mkdir(parents=True, exist_ok=True) 
        filename = save_dir / f"{self.text_files[curr].stem}.json"
        with open(filename, 'w') as file:
            json.dump(labels, file)
        return {"message": "Labels saved"}, 200
    
    
    
     