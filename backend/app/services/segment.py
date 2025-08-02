
from dataclasses import dataclass
from loguru import logger as logging
import textdistance
from collections import defaultdict
import pprint
from sentence_transformers import SentenceTransformer, util
from app.services.analyzer import Analyzer
from intervaltree import IntervalTree, Interval

@dataclass
class Segment:
    labels:list
    text:str
    agreement:bool = False



class SegmentProvider:
            
    @staticmethod
    def find_agreements(text, segments, matching_criteria):
        analyzer = Analyzer(matching_criteria)
        return [seg.labels for seg in segments if analyzer.has_match(seg.labels)]

    @staticmethod
    def find_disagreements(segments, matching_criteria='exact'):
        analyzer = Analyzer(matching_criteria)
        disagreements = []
        for seg in segments:
            labels = seg.labels
            if len(labels)==1 and seg.text.strip() == labels[0].get('text', '').strip():    
                disagreements.append(labels)
            elif len(labels) >=2  and  not analyzer.has_match(labels):
                disagreements.append(labels)
        return disagreements
    
  
 

    
    @staticmethod
    def get_text_segments(text, labels_dict, matching_criteria='exact'):
        all_labels = []
        for user, labels in labels_dict.items():
            for label in labels:
                label['user'] = user
                all_labels.append(label)

        # Build interval tree with all labels
        tree = IntervalTree()
        for label in all_labels:
            tree.addi(label['start'], label['end'], label)

        # Collect and sort all unique boundary points
        boundaries = set()
        for label in all_labels:
            boundaries.update({label['start'], label['end']})
        sorted_boundaries = sorted(boundaries)
        if len(text) not in sorted_boundaries:
            sorted_boundaries.append(len(text))

        # Generate segments between each consecutive boundary
        segments = []
        prev = 0
        analyzer = Analyzer(matching_criteria)
        for current in sorted_boundaries:
            if current <= prev:
                continue
            # Query overlapping labels for current segment
            active_intervals = tree.overlap(prev, current)
            active_labels = [interval.data for interval in active_intervals]
            agreement = analyzer.has_match(active_labels)
            segment_text = text[prev:current]
            segments.append(Segment(labels=active_labels, 
                                   text=segment_text, 
                                   agreement=agreement))
            prev = current

        return segments


    

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
    print(segments)
   