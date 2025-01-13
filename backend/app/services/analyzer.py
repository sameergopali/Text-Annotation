
from loguru import logger
class JaccardAnalyzer:  
    def __init__(self, max_threshold=0.7):
        self.max_threshold = max_threshold   
    
    def __similarity(self, label1, label2): 
        set1 = set(label1['text'].split())
        set2 = set(label2['text'].split())
        return len(set1.intersection(set2)) / len(set1.union(set2))
    
    def has_match(self, labels):
        label1, label2 = labels
        
        sim = self.__similarity(label1, label2) 
        logger.debug(f"sim: {sim}")
        return sim >= self.max_threshold 
    
class ExactAnalyzer:
    def has_match(self, labels):
        label1, label2 = labels
        return  label1['start'] == label2['start'] and \
                label1['end'] == label2['end']  and\
                label1['codes'] == label2['codes']


class Analyzer:
    def __init__(self, matching_strategy):
        if matching_strategy == 'Jaccard':
            self.matching_strategy = JaccardAnalyzer()  
        elif matching_strategy == 'exact':
            self.matching_strategy = ExactAnalyzer()
        
    def has_match(self, labels):
        if len(labels) <= 1:
            return False
        return self.matching_strategy.has_match(labels)
  
        
        
        