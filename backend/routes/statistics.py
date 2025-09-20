from flask import Blueprint, jsonify
from models import db, LawDocument, ChatHistory, User
from datetime import datetime, timedelta
import logging

bp = Blueprint('statistics', __name__, url_prefix='/api/statistics')
logger = logging.getLogger(__name__)

@bp.route('', methods=['GET'])
def get_statistics():
    try:
        # إحصائيات الوثائق القانونية
        documents_count = LawDocument.query.count()
        
        # إحصائيات المحادثات (آخر 30 يوم)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_chats = ChatHistory.query.filter(
            ChatHistory.timestamp >= thirty_days_ago
        ).count()
        
        # إحصائيات المستخدمين
        active_users = User.query.filter(User.last_login >= thirty_days_ago).count()
        total_users = User.query.count()
        
        # حساب دقة النظام (نسبة وهمية لأغراض العرض)
        accuracy = 94  # في التطبيق الحقيقي، سيتم حساب هذه القيمة بناءً على تحليل الأداء
        
        return jsonify({
            'judgments': documents_count,
            'recentChats': recent_chats,
            'activeUsers': active_users,
            'totalUsers': total_users,
            'accuracy': accuracy
        })
        
    except Exception as e:
        logger.error(f"Error fetching statistics: {str(e)}")
        return jsonify({'error': 'حدث خطأ أثناء جلب الإحصائيات'}), 500

@bp.route('/usage', methods=['GET'])
def get_usage_stats():
    try:
        # إحصائيات الاستخدام خلال آخر 7 أيام
        usage_data = []
        for i in range(7):
            date = datetime.utcnow() - timedelta(days=i)
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            daily_chats = ChatHistory.query.filter(
                ChatHistory.timestamp >= start_of_day,
                ChatHistory.timestamp <= end_of_day
            ).count()
            
            usage_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'chats': daily_chats
            })
        
        return jsonify({
            'usage': usage_data
        })
        
    except Exception as e:
        logger.error(f"Error fetching usage statistics: {str(e)}")
        return jsonify({'error': 'حدث خطأ أثناء جلب إحصائيات الاستخدام'}), 500