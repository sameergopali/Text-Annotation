from presidio_anonymizer import AnonymizerEngine
from presidio_analyzer import AnalyzerEngine
from presidio_analyzer.nlp_engine import NlpEngineProvider
from presidio_anonymizer.entities import OperatorConfig
import sys
import argparse
from tqdm import tqdm
from loguru import logger
from typing import List
from dataclasses import dataclass
import re
from pathlib import Path


@dataclass
class EntityAnalyzer:
    entities: List[str]
    analyzer: AnalyzerEngine

class PiiAnonymizer:
    def __init__(self):
        self._analyzers = []
        self._anonymizer = AnonymizerEngine()
        self.name_mapping = {} 
        self.hospital_mapping = {}
        self._configure()
        
        conf_bert = Path(__file__).parent/"config_bert.yaml"
        provider_bert = NlpEngineProvider(conf_file=conf_bert)

        conf_standford =Path(__file__).parent/"config_standford.yaml"
        provider_standford = NlpEngineProvider(conf_file=conf_standford)

        nlp_engine_bert = provider_bert.create_engine()
        nlp_engine_standford = provider_standford.create_engine()
        
        self.add_analyzer(EntityAnalyzer(entities=["PERSON","ORGANIZATION","PHONE_NUMBER","EMAIL_ADDRESS","ID"], analyzer=AnalyzerEngine()))
        self.add_analyzer(EntityAnalyzer(entities=["PERSON","DATE_TIME", "ORGANIZATION"], analyzer=AnalyzerEngine(nlp_engine=nlp_engine_standford, supported_languages=["en"])))
        self.add_analyzer(EntityAnalyzer(entities=["PERSON", "AGE","LOCATION"], analyzer=AnalyzerEngine(nlp_engine=nlp_engine_bert, supported_languages=["en"])))

    def add_analyzer(self, analyzer):
        self._analyzers.append(analyzer)


    import re

# Helper function to replace months and retain format
    def replace_month_and_date(self,original_text):
        # Replace relative dates like today, yesterday, last week with the same text
        relative_dates = ["now", "evening", "tonight", "morning", "noon","today", "yesterday", "week", "month", "year", "tomorrow"]
        # Check if the text is a timestamp or date
        timestamp_pattern = re.compile(r"\b\d{1,2}([\.:;\s]{0,1}\d{2})?\s*(AM|PM)?\b")
       
        for date in relative_dates:
            if date in original_text.lower():
                return original_text
       
        if timestamp_pattern.fullmatch(original_text):
            logger.debug(f"{original_text=}")
            return 'HH:MM'
        
        original_text = "MM/DD/YYYY"
        return original_text

       
    def replace_name(self, text):  
        title = ""
        title_match = re.match(r"(Dr|Dr|Drs|Mr|Mrs|Ms|Hi|Hello|Dear|Greetings)\s*", text, re.IGNORECASE)
        if title_match:
            logger.debug(f"{title_match=}")
            title = title_match.group(0)
            name = text[len(title):]
            logger.debug(f"{title=} {name=}")
        else:
            name = text
        new_name = self.name_mapping.get(name, name)  
        return f"{title} {new_name}" if title else new_name
            

    def replace_email_headers(self,text):
        pattern = re.compile(r"From: .*? Sent: .*? To: .*? Subject:", re.DOTALL)
        return pattern.sub("From:  Sent:  To: Subject:", text)

        

    def _configure(self, operators=None): 
        self.operators = {
                "PERSON": OperatorConfig("custom", {"lambda": lambda x: self.replace_name(x)}),
                "PHONE_NUMBER": OperatorConfig("replace", {"new_value": "XXX-XXX-XXXX"}),
                "DATE_TIME": OperatorConfig("custom", {"lambda": lambda x: self.replace_month_and_date(x)}),
                "EMAIL_ADDRESS": OperatorConfig("replace", {"new_value": "address@email.com"}),
                "ORGANIZATION": OperatorConfig("custom", {"lambda": lambda x: self.hospital_mapping.get(x, x)}),
                "LOCATION": OperatorConfig("replace", {"new_value": "LOCATION"}),
                "AGE": OperatorConfig("replace", {"new_value": "XX"}),
                "ID": OperatorConfig("replace", {"new_value": "ID:XXXXX"})
            }

    def _analyze(self, text):
        analyzer_results = []
        for entity_analyzer in self._analyzers:
            analyzer =  entity_analyzer.analyzer
            analyzer_results += analyzer.analyze(text=text, entities=entity_analyzer.entities, language="en")
        return analyzer_results

    def _init_mapping(self, analyzer_results, text):
        logger.debug(f"{analyzer_results=}")    
        for result in analyzer_results:
            logger.debug(f"{result.entity_type=}")
            if result.entity_type == "PERSON":
              
                # Preserve titles like Dr., Mrs., etc.
                name_with_title = text[result.start:result.end]
                title = ""
                title_match = re.match(r"(Dr|Drs|Mr|Mrs|Ms|Hi|Hello|Dear|Greetings|Miss)\s*", name_with_title, re.IGNORECASE)
                if title_match:
                    logger.debug(f"{title_match=}")
                    title = title_match.group(0)
                    name = name_with_title[len(title):]
                else:
                    name = name_with_title
                if name not in self.name_mapping:
                    new_name = f"Person{len(self.name_mapping) + 1}"  # Ensure uniqueness
                    self.name_mapping[name] = new_name

                # Reconstruct the name with title if it exists
                
                logger.debug(f"{self.name_mapping=}")
                
            elif result.entity_type == "ORGANIZATION":
                # Assign a random custom hospital name from the list
                
                org= text[result.start:result.end]
                if org not in self.hospital_mapping:
                    new_org = f"Org{len(self.name_mapping) + 1}"  # Ensure uniqueness
                    self.hospital_mapping[org] = new_org

    def _reset_mapping(self):
        self.name_mapping = {}
        self.hospital_mapping = {}

    def _anonymize(self, analyzer_results,text):
        logger.debug(f"{analyzer_results=}")    
        logger.debug(f"{self.name_mapping=}")
        anonymized_result = self._anonymizer.anonymize(
            text=text,
            analyzer_results=analyzer_results,
            operators=self.operators
        )
        logger.debug(f"{anonymized_result.text=}")
        return anonymized_result.text

    def anonymize(self, text, use_mapping=False):
        text = self.replace_email_headers(text.strip())
        analyzer_results = self._analyze(text)
        logger.debug(f"{text=} {analyzer_results=}")
        self._reset_mapping()   
        self._init_mapping(analyzer_results, text)
        masked_text =  self._anonymize(analyzer_results, text)
        logger.info(f"{masked_text=}")  
        return masked_text + "\n"
    


