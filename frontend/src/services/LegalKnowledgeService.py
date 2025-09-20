from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json
from datetime import datetime
from database import db

class LegalKnowledgeService:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    
    def search_laws(self, query, filters=None, limit=10):
        # البحث في القوانين مع التصفية
        laws = self._query_laws(filters)
        results = self._semantic_search(query, laws, ['title', 'content'])
        return results[:limit]
    
    def search_judgments(self, query, filters=None, limit=10):
        # البحث في الأحكام مع التصفية
        judgments = self._query_judgments(filters)
        results = self._semantic_search(query, judgments, ['case_number', 'summary', 'full_text'])
        return results[:limit]
    
    def search_procedures(self, query, filters=None, limit=10):
        # البحث في الإجراءات مع التصفية
        procedures = self._query_procedures(filters)
        results = self._semantic_search(query, procedures, ['title', 'description'])
        return results[:limit]
    
    def _semantic_search(self, query, items, text_fields):
        # البحث الدلالي باستخدام embeddings
        query_embedding = self.model.encode(query)
        
        results = []
        for item in items:
            # دمج الحقول النصية للبحث
            item_text = ' '.join(str(item.get(field, '')) for field in text_fields)
            item_embedding = self.model.encode(item_text)
            
            similarity = cosine_similarity([query_embedding], [item_embedding])[0][0]
            
            if similarity > 0.3:  # عتبة التشابه
                result = {
                    'id': item.id,
                    'type': item.__tablename__[:-1],  # law, judgment, procedure
                    'similarity': float(similarity),
                    'data': item.to_dict()
                }
                results.append(result)
        
        # ترتيب النتائج حسب التشابه
        results.sort(key=lambda x: x['similarity'], reverse=True)
        return results
    
    def answer_legal_question(self, question, context=None):
        # البحث في جميع المصادر
        laws_results = self.search_laws(question, limit=3)
        judgments_results = self.search_judgments(question, limit=3)
        procedures_results = self.search_procedures(question, limit=3)
        
        # دمج وتصنيف النتائج
        all_results = laws_results + judgments_results + procedures_results
        all_results.sort(key=lambda x: x['similarity'], reverse=True)
        
        # توليد الإجابة
        answer = self._generate_answer(question, all_results)
        
        return {
            'answer': answer,
            'sources': all_results[:5],  # أفضل 5 نتائج
            'confidence': all_results[0]['similarity'] if all_results else 0.0
        }
    
    def _generate_answer(self, question, sources):
        if not sources:
            return "عذراً، لم أتمكن من العثور على إجابة محددة لسؤالك. يوصى بالاستعانة بمحامٍ متخصص."
        
        primary_source = sources[0]
        source_type = primary_source['type']
        source_data = primary_source['data']
        
        if source_type == 'law':
            return f"بناءً على المادة {source_data.get('article_number', '')} من {source_data.get('title', '')}: {source_data.get('content', '')[:200]}..."
        elif source_type == 'judgment':
            return f"في القضية رقم {source_data.get('case_number', '')}، قضت المحكمة بما يلي: {source_data.get('summary', source_data.get('full_text', ''))[:200]}..."
        elif source_type == 'procedure':
            return f"الإجراء المتبع هو: {source_data.get('description', '')[:200]}..."
        
        return "تم العثور على معلومات ذات صلة بسؤالك. يوصى بمراجعة المصادر القانونية المتخصصة."