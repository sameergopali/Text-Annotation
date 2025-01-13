from pathlib import Path    
from loguru import logger   
from flask import request
from flask_jwt_extended import get_jwt_identity
from .segment import SegmentProvider
import json

class TextService:
    def __init__(self):
        self.base_dir = Path(__file__).parent.parent / 'data'
      
    def _get_textSegments(self, curr, users, folder, matching_criteria):
        text = self._get_text(curr, folder)
        labels ={user:self._get_labels(user, folder, curr) for user in users}
        logger.info(f"Labels: {labels}")
        segments = SegmentProvider.get_text_segments(text, labels, matching_criteria)
        return segments    
    
    def get_segments(self):
        curr = int(request.args.get('curr', 0))
        folder = request.args.get('folder', 'default_folder')
        users = request.args.get('users', [])
        matching_criteria = request.args.get('matchingCriteria', 'exact')  
        logger.info(f"Users == {users}")
        segments = self._get_textSegments(curr, users.split(','), folder, matching_criteria)
        return {"segments": segments}

        
    def get_total(self):
        username = get_jwt_identity()
        folder = request.args.get('folder', 'default_folder')
        logger.info(f"Getting total for {username} in folder {folder}")
        self.text_files = list((self.base_dir/'txt_files'/folder).glob('*.txt'))
        return {"total": len(self.text_files)}
    
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
    
    def _get_text(self, curr, folder):
        filename = f"message{curr}.txt"
        self.text_files = list((self.base_dir/'txt_files'/folder).glob('message*.txt'))
        if curr >= len(self.text_files):
            return {"text": "No more text files", "curr": curr}
        file_path = self.base_dir/'txt_files'/folder/filename
        logger.info(f"Reading file: {file_path}")
        with open(file_path, 'r') as file:
            text = file.read()
        return text
        
    def get_text(self):
        username = get_jwt_identity()  
        logger.info(f"username: {username}")
        curr = int(request.args.get('curr', 0))
        folder = request.args.get('folder', 'default_folder')
        text = self._get_text(curr, folder)
        return {"text": text, "curr": curr}
    
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
        with open(filename, 'w') as file:
            for label in labels:
                json.dump(label, file)
                file.write('\n')
        return {"message": "Labels saved"}, 200
    
    
    
    def get_user(self):
        username = get_jwt_identity()
        folder = request.args.get('folder', 'default_folder')
        logger.info(f"Getting user {username} in folder {folder}")
        logger.debug(list((self.base_dir/'labels'/f"{folder}").glob('*')))
        folders = [folder.name for folder in (self.base_dir/'labels'/f"{folder}").glob('*') if folder.is_dir()]
        logger.debug(f"Users: {folders}")
        return {"users": folders} 
        
    def get_agreements(self):
        curr = int(request.args.get('curr', 0))
        folder = request.args.get('folder', 'default_folder')
        users = request.args.get('users', [])
        matching_criteria = request.args.get('matching_criteria', 'exact')
        logger.info(f"Users == {users}")
        text = self._get_text(curr, folder)
        segments = self._get_textSegments(curr, users.split(','), folder, matching_criteria)
        agreements = SegmentProvider.find_agreements(text,segments, matching_criteria)
        return {"agreements": agreements}

    def get_disagreements(self):
        curr = int(request.args.get('curr', 0))
        folder = request.args.get('folder', 'default_folder')
        users = request.args.get('users', [])
        matching_criteria = request.args.get('matchingCriteria', 'exact')
        logger.info(f"Users == {users}")
        segments = self._get_textSegments(curr, users.split(','), folder, matching_criteria)
        disagreements = SegmentProvider.find_disagreements(segments, matching_criteria)
        return {"disagreements": disagreements}
    
    def import_file(self):
        data = request.files['file']
        logger.info(f"Data: {data}")
        if 'file' not in request.files:
            return {"error": "No file part in the request"}, 400

        uploaded_file = request.files['file']  # Access the file
        if uploaded_file.filename == '':
            return {"error": "No file selected"}, 400
        file_content = uploaded_file.read().decode('utf-8') 
        logger.info([folder_name for folder_name in (self.base_dir/'txt_files').glob('*') if folder_name.is_dir()])
        ind = max(int(folder.name.split('sample')[1]) for folder in (self.base_dir/'txt_files').glob('sample*') if folder.is_dir())
        new_folder_name = f'sample{ind+1}'
        save_dir = self.base_dir/'txt_files'/new_folder_name
        save_dir.mkdir(parents=True, exist_ok=True)
        
        for i, line in enumerate(file_content.split('\n')):
            filename = save_dir / f'message{i}.txt'
            with open(filename, 'w') as file:
                file.write(line)
 
        
        return {"message": "File imported"}, 200
    