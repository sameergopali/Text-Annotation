from pathlib import Path    
from loguru import logger   
from flask import request
from flask_jwt_extended import get_jwt_identity
import json

class TextService:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent / 'data'
      

        
    def get_folders(self):
        username = get_jwt_identity()
        logger.info(f"Getting folders for {username}")
        folders = [folder.name for folder in (self.base_dir/'txt_files').glob('*') if folder.is_dir()]
        return {"folders": folders}
    
    def _get_labels(self, username, folder,curr):
        logger.info(f"Getting labels for {username} in folder {folder}")
        save_dir = self.base_dir/'labels' /f'{folder}'/ f"{username}"
        logger.info(f"Save dir: {save_dir}")
        filename = save_dir / f"message{curr}.jsonl"
        logger.info(f"Filename: {filename}")
        labels = []
        if filename.exists():
            logger.debug(f"Reading labels from {filename}")
            with open(filename, 'r') as file:
                for line in file:
                    logger.debug(f"Line: {line}")
                    labels.append(json.loads(line.strip()))
                labels.sort(key=lambda x: x['start'])
            logger.info(f"Labels: {labels}")
            return labels
        return []
    
    def get_labels(self):
        username = get_jwt_identity()  
        curr = int(request.args.get('curr', 0))
        username = request.args.get('user', username)
        folder = request.args.get('folder', 'default_folder')
        labels  = self._get_labels(username, folder, curr)
        return {"labels": labels}
        
    def get_text(self):
        username = get_jwt_identity()  
        logger.info(f"username: {username}")
        curr = int(request.args.get('curr', 0))
        username = request.args.get('user', username)
        folder = request.args.get('folder', 'default_folder')
        self.text_files = list((self.base_dir/'txt_files'/folder).glob('*.txt'))
        logger.info(f"Getting text for {username} in folder {folder}")
        labels  = self._get_labels(username, folder, curr)
    
        if curr >= len(self.text_files):
            return {"text": "No more text files", "curr": curr}
        file_path = self.text_files[curr]
        logger.info(f"Reading file: {file_path}")
        with open(file_path, 'r') as file:
            text = file.read()
        
        return {"text": text, "curr": curr, "labels": labels, "total": len(self.text_files)}
    
    def save_labels(self):
        data = request.get_json()
        username = data.get('user')
        curr  = int(data.get('curr'))
        folder = data.get('folder', 'default_folder')
        labels = data.get('labels')
        logger.info(f"Data: {data}")
        logger.info(f"Saving labels for {username} in folder {folder}")
        save_dir =self.base_dir/'labels' /f'{folder}'/ f"{username}"
        save_dir.mkdir(parents=True, exist_ok=True) 
        filename = save_dir / f"message{curr}.jsonl"
        prev_id = 0
        with open(filename, 'w') as file:
            for label in labels:
                json.dump(label, file)
                file.write('\n')
        return {"message": "Labels saved"}, 200
    
    
    
    def get_user(self):
        username = get_jwt_identity()
        folder = request.args.get('folder', 'default_folder')
        logger.info(f"Getting user {username} in folder {folder}")
        folders = [folder.name for folder in (self.base_dir/'labels'/f'{folder}').glob('*') if folder.is_dir()]
        return {"users": folders} 
        