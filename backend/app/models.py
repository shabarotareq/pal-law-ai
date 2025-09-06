from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ChatHistory(db.Model):
    __tablename__ = 'chat_history'
    
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    is_user = db.Column(db.Boolean, nullable=False)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'message': self.message,
            'is_user': self.is_user,
            'timestamp': self.timestamp.isoformat()
        }

class LawDocument(db.Model):
    __tablename__ = 'law_documents'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    keywords = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'keywords': self.keywords
        }

# يمكن إضافة المزيد من النماذج حسب الحاجة