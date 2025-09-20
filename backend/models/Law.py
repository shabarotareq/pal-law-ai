from database import db
from sqlalchemy.dialects.postgresql import JSONB

class Law(db.Model):
    __tablename__ = 'laws'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    content = db.Column(db.Text, nullable=False)
    article_number = db.Column(db.String(100))
    category = db.Column(db.String(200))
    issuance_date = db.Column(db.Date)
    effective_date = db.Column(db.Date)
    version = db.Column(db.String(100))
    embedding = db.Column(db.LargeBinary)  # للتخزين الفعال
    metadata = db.Column(JSONB)  # معلومات إضافية
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), 
                          onupdate=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'article_number': self.article_number,
            'category': self.category,
            'issuance_date': self.issuance_date.isoformat() if self.issuance_date else None,
            'effective_date': self.effective_date.isoformat() if self.effective_date else None,
            'version': self.version,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }