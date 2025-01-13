
from dataclasses import dataclass
from loguru import logger as logging
import textdistance
from collections import defaultdict
import pprint
from sentence_transformers import SentenceTransformer, util
from .analyzer import Analyzer


@dataclass
class Segment:
    labels:list
    text:str
    agreement:bool = False
    

@dataclass
class Entry:
    pos: int
    type: str
    label: dict
    user: str

@dataclass
class Agreements:
    labels: list
    
@dataclass
class Disagreements:
    labels: list
    

class SegmentProvider:
    
    @staticmethod
    def similarity(labels):
        text1 , text2 = labels[0]['text'], labels[1]['text']
        logging.warning(f"Similarity: {text1} Text2: {text2}")    
        model = SentenceTransformer("nomic-ai/modernbert-embed-base")#Compute embedding for both lists
        embedding_1= model.encode(text1, convert_to_tensor=True)
        embedding_2 = model.encode(text2, convert_to_tensor=True)
        
        sim = util.pytorch_cos_sim(embedding_1, embedding_2)
        logging.info(f"Similarity: {sim}")   
        return sim
        
    
    @staticmethod
    def overlap_ratio(labels):
        """
        Classify the type of overlap between two spans.

        Args:
            span1 (tuple): (start, end) indices of first span
            span2 (tuple): (start, end) indices of second span
            strong_overlap_threshold (float): Threshold for considering overlap as 'strong'

        Returns:
            dict: Classification results including overlap type and metrics
        """
        start1, end1 = labels[0]['start'], labels[0]['end']
        start2, end2 = labels[1]['start'], labels[1]['end']

        # Calculate basic lengths
        span1_length = end1 - start1
        span2_length = end2 - start2

        # Find overlap region
        overlap_start = max(start1, start2)
        overlap_end = min(end1, end2)
        overlap_length = max(0, overlap_end - overlap_start)

        # Calculate overlap ratio relative to each span
        ratio1 = overlap_length / span1_length if span1_length > 0 else 0
        ratio2 = overlap_length / span2_length if span2_length > 0 else 0
        
        return max(ratio1, ratio2), min(ratio1, ratio2)
       
    
  
                
    @staticmethod
    def has_exact_match(labels):
        """
        Check if all labels have an exact match within the list.

        :param labels: List of dictionaries with keys `user`, `start`, `end`, and `codes` (list of codes).
        :return: Boolean indicating if all labels have an exact match.
        """
        if not labels:
            return False
        label1, label2 = labels
        return  label1['start'] == label2['start'] and \
                label1['end'] == label2['end'] and \
                label1['codes'] == label2['codes']
            
    
    @staticmethod
    def find_agreements(text,segments, matching_criteria):
        analyzer = Analyzer(matching_criteria)
        agreements = [] 
        for segment in segments:
            if len(segment.labels) > 1:
                if analyzer.has_match(segment.labels):
                    agreements.append(segment.labels)
                   
        return agreements
    
    @staticmethod
    def find_disagreements(segments, matching_criteria='exact'):
        def contains(label1, label2):
            return  (label1['start'] <= label2['start'] and label1['end'] > label2['end']) or \
                    (label1['start'] < label2['start'] and label1['end'] >= label2['end']) or \
                    (label1['start'] >= label2['start'] and label1['end'] < label2['end']) or \
                    (label1['start'] > label2['start'] and label1['end'] <= label2['end'])
        
        disagreements = []
        logging.info(f"Finding disagreements, segments: {segments}")
        
        for segment in segments:
            if len(segment.labels) == 1:
                if segment.text == segment.labels[0]['text']:
                    logging.warning(segment.labels[0])
                    disagreements.append([segment.labels[0]])   
                    
            elif len(segment.labels) > 1:
                label1, label2 = segment.labels 
                if  label1['start'] == label2['start'] and label1['end'] == label2['end'] and label1['codes'] != label2['codes']:
                    disagreements.append([label1, label2])
                    logging.warning(f"Disagreements: {disagreements}") 
                elif max(label1['start'], label2['start']) <= min(label1['end'], label2['end']) and (label1['start'] != label2['start'] or label1['end'] != label2['end']) :
                    disagreements.append([label1, label2])
        logging.warning(f"Disagreements: {disagreements}") 

        return disagreements
    
    @staticmethod
    def _populate_entries( labels_dict):
        entries = []
        for user, labels in labels_dict.items():
            for label in labels:
               entries.append(Entry(label['start'], "start", label, user))
               entries.append(Entry(label['end'],"end" , label, user))
        print(entries)
        return entries
    
    
    @staticmethod
    def get_text_segments(text, labels_dict, matching_criteria='exact'):
        logging.error(matching_criteria)
        analyzer =   Analyzer(matching_criteria)
        logging.info(f"Getting text segments for {text}")
        logging.info(f"Getting text segments for {labels_dict} annotators") 
         # Step 1: Collect all label events from all annotators
        entries = SegmentProvider._populate_entries(labels_dict)

         # Step 2: Sort annotation events by position, breaking ties by event type ('end' before 'start')
        entries.sort(key=lambda x: (x.pos, x.type=='end'))  

        # Step 3: Process annotation events to generate text segments
        text_segments = [ ]
        active = []  # Dictionary to track active annotations by annotator
        prev = 0
        for entry in entries:
            if entry.pos > prev:
                agreement =analyzer.has_match(active)
                text_segments.append(
                    Segment(labels=active[:],
                            text=text[prev:entry.pos],
                            agreement=agreement)
                )
            
            # Update active annotations based on event type
            if entry.type == 'start':
                # add annotator to label    {start, end, user,codes , annotator}
                entry.label['user'] = entry.user 
                active.append(entry.label)
            elif entry.type == 'end':
                active.remove(entry.label)
            prev = entry.pos
            
        # Step 4: Add the final segment if there is remaining text
        if prev < len(text):
            agreement = analyzer.has_match(active)
            text_segments.append(
                Segment(labels=active[:], text=text[prev:], agreement=agreement)
            )
        
        logging.info(f"Text segments: {text_segments}")
        return text_segments
    

if __name__ == "__main__":
    text = "John lives in New York and works for OpenAI. He studies AI ethics. He is a member of the ACM. He is a member of the ACM. He likes to play chess." 
    labels = {
        "annotator1": [
            {"start": 0, "end": 10, "codes": ["person"]}, #exact match
            {"start": 11, "end":15, "codes": ["location"]},
            {"start": 22, "end": 35, "codes": ["location"]},
            {"start": 61, "end": 67, "codes": ["organization"]},
            {"start": 68, "end": 78, "codes": ["organization"]},  # exact matchs
            {"start": 98, "end": 102, "codes": ["topic"]},
            {"start": 115, "end": 126, "codes": ["person"]}, # exact match
        ],
        "annotator2": [
            {"start": 0, "end": 10, "codes": ["person"]},
            {"start": 22, "end": 34, "codes": ["location"]},
            {"start": 68, "end": 78, "codes": ["organization"]}, # exact match
            {"start": 98, "end": 110, "codes": ["topic"]},
            {"start": 115, "end": 126, "codes": ["location"]}, # exact match
        ]
    }

    segments = SegmentProvider().get_text_segments(text, labels)
    logging.warning(SegmentProvider.find_agreements(text, segments, matching_criteria="Jaccard"))
    logging.warning(SegmentProvider.find_disagreements(text,segments, matching_criteria="Jaccard"))