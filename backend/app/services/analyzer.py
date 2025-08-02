
from loguru import logger
    
class ExactAnalyzer:
    def has_match(self, labels):
        """
        Check if all labels have an exact match for any number of users.

        :param labels: List of dictionaries, each containing `start`, `end`, and `codes`.
        :return: Boolean indicating if all labels match exactly.
        """
        if len(labels) < 2:
            # No match possible if fewer than two labels are provided
            return False
        
        # Use the first label as the reference for comparison
        reference = labels[0]
        for label in labels[1:]:
            if (
                label['start'] != reference['start'] or
                label['end'] != reference['end'] or
                label['codes'] != reference['codes']
            ):
                return False  # Return early if any label differs

        # If all labels match the reference, return True
        return True



class Analyzer:
    def __init__(self, matching_strategy):
        if matching_strategy == 'exact':
            self.matching_strategy = ExactAnalyzer()
        
    def has_match(self, labels):
        if len(labels) <= 1:
            return False
        return self.matching_strategy.has_match(labels)
  
        
        
        