
from rapidfuzz import process
from flask import request, jsonify
from rapidfuzz import fuzz, process
from loguru import logger   
import json
from pathlib import Path    

class SearchService:
    def __init__(self):
        self.threshold = 80 
    
    # Generator to read JSONL file line by line
    def read_jsonl(self,file_path):
        with open(file_path, "r") as file:
            for line in file:
                yield json.loads(line.strip())


    def _search(self, query):
        matches = []
        
        file_path = Path(__file__).parent/"records.jsonl"

        # Read and process each line of the file
        for record in self.read_jsonl(file_path):
            for annotation in record.get("annotations", []):

            # Combine span and codes into searchable strings
                span_match = fuzz.token_set_ratio(query, annotation["text"])
                codes_match = fuzz.partial_token_set_ratio(query.lower(), " ".join(annotation["codes"]).lower())

                # Add the matches to the list with their scores
                if span_match > 50 or codes_match > 80:
                    logger.debug(f"{annotation['text']} - {annotation['codes'] } - {span_match} - {codes_match}")

                    match = {"annotation":annotation, "context": record["context"]}
                    matches.append({"record": match, "score": max(span_match, codes_match)})    

        # Sort the matches by score and limit results
        matches = sorted(matches, key=lambda x: x["score"], reverse=True)
        matches = [match["record"] for match in matches] 
        return matches
       
    
    def search(self):
        query = request.args.get('query', '')
        logger.info(f"Searching for {query}")   
        if not query:
            return jsonify({"results": []}), 200
        results = self._search(query)
        return {"results": results}
    