from flask import Blueprint, request, jsonify
from services.LegalKnowledgeService import LegalKnowledgeService

search_bp = Blueprint('search', __name__)
knowledge_service = LegalKnowledgeService()

@search_bp.route('/search', methods=['POST'])
def search_legal_knowledge():
    try:
        data = request.get_json()
        query = data.get('query', '')
        filters = data.get('filters', {})
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # البحث في جميع المصادر
        laws = knowledge_service.search_laws(query, filters)
        judgments = knowledge_service.search_judgments(query, filters)
        procedures = knowledge_service.search_procedures(query, filters)
        
        # دمج النتائج
        all_results = laws + judgments + procedures
        all_results.sort(key=lambda x: x['similarity'], reverse=True)
        
        return jsonify({
            'results': all_results,
            'total_count': len(all_results),
            'query': query
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@search_bp.route('/ask', methods=['POST'])
def ask_legal_question():
    try:
        data = request.get_json()
        question = data.get('question', '')
        context = data.get('context', None)
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
        
        answer = knowledge_service.answer_legal_question(question, context)
        
        return jsonify(answer)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
