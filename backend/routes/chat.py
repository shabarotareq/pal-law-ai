from flask import Blueprint, request, jsonify
from models import db, ChatHistory
from utils.ai_processor import AIProcessor
import logging

bp = Blueprint('chat', __name__, url_prefix='/api/chat')
ai_processor = AIProcessor()
logger = logging.getLogger(__name__)

@bp.route('', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'الرسالة مطلوبة'}), 400
        
        user_message = data['message'].strip()
        if not user_message:
            return jsonify({'error': 'الرسالة لا يمكن أن تكون فارغة'}), 400
        
        # حفظ رسالة المستخدم
        user_chat = ChatHistory(message=user_message, is_user=True)
        db.session.add(user_chat)
        
        # معالجة الرسالة
        ai_response = ai_processor.process_message(user_message)
        
        # حفظ رد المساعد
        bot_chat = ChatHistory(message=ai_response, is_user=False)
        db.session.add(bot_chat)
        
        db.session.commit()
        
        return jsonify({
            'answer': ai_response,
            'message_id': user_chat.id,
            'response_id': bot_chat.id
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        db.session.rollback()
        return jsonify({'error': 'حدث خطأ أثناء معالجة طلبك'}), 500

@bp.route('/history', methods=['GET'])
def get_chat_history():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        chats = ChatHistory.query.order_by(ChatHistory.timestamp.desc()).paginate(
            page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'chats': [chat.to_dict() for chat in chats.items],
            'total': chats.total,
            'pages': chats.pages,
            'current_page': page
        })
        
    except Exception as e:
        logger.error(f"Error fetching chat history: {str(e)}")
        return jsonify({'error': 'حدث خطأ أثناء جلب سجل المحادثات'}), 500