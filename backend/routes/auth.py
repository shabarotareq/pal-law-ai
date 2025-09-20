from flask import Blueprint, jsonify, request
from datetime import datetime, timedelta
import jwt

bp = Blueprint('auth', __name__)

# مفتاح سري للتوقيع (يجب تغييره في production)
SECRET_KEY = "pal-law-ai-secret-key-2023"

# مستخدمين افتراضيين (في production سيتم تخزينهم في قاعدة بيانات)
users = [
    {
        "id": 1,
        "username": "admin",
        "password": "admin123",  # في production يجب تشفير كلمات المرور
        "role": "admin",
        "name": "مدير النظام",
        "email": "admin@pal-law.ai"
    },
    {
        "id": 2,
        "username": "lawyer1",
        "password": "lawyer123",
        "role": "lawyer",
        "name": "المحامي محمد",
        "email": "mohamed@lawfirm.com",
        "specialization": "قانون تجاري"
    },
    {
        "id": 3,
        "username": "judge1",
        "password": "judge123",
        "role": "judge",
        "name": "القاضي أحمد",
        "email": "ahmed@court.gov",
        "court": "محكمة بداية رام الله"
    }
]

@bp.route('/login', methods=['POST'])
def login():
    """تسجيل الدخول"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"error": "يرجى تقديم اسم المستخدم وكلمة المرور"}), 400
    
    # البحث عن المستخدم
    user = next((u for u in users if u['username'] == username and u['password'] == password), None)
    
    if not user:
        return jsonify({"error": "اسم المستخدم أو كلمة المرور غير صحيحة"}), 401
    
    # إنشاء token
    token_payload = {
        'user_id': user['id'],
        'username': user['username'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=24)
    }
    
    token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')
    
    # إرجاع البيانات بدون كلمة المرور
    user_data = {k: v for k, v in user.items() if k != 'password'}
    
    return jsonify({
        "message": "تم تسجيل الدخول بنجاح",
        "token": token,
        "user": user_data
    })

@bp.route('/register', methods=['POST'])
def register():
    """تسجيل مستخدم جديد"""
    data = request.get_json()
    
    required_fields = ['username', 'password', 'email', 'name', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"حقل {field} مطلوب"}), 400
    
    # التحقق إذا كان اسم المستخدم موجود مسبقاً
    if any(u['username'] == data['username'] for u in users):
        return jsonify({"error": "اسم المستخدم موجود مسبقاً"}), 409
    
    # إنشاء مستخدم جديد
    new_user = {
        "id": len(users) + 1,
        "username": data['username'],
        "password": data['password'],  # في production يجب تشفير كلمة المرور
        "email": data['email'],
        "name": data['name'],
        "role": data['role'],
        "created_at": datetime.now().isoformat()
    }
    
    # إضافة حقول إضافية حسب الدور
    if data['role'] == 'lawyer':
        new_user['specialization'] = data.get('specialization', '')
    elif data['role'] == 'judge':
        new_user['court'] = data.get('court', '')
    
    users.append(new_user)
    
    # إرجاع البيانات بدون كلمة المرور
    user_data = {k: v for k, v in new_user.items() if k != 'password'}
    
    return jsonify({
        "message": "تم إنشاء الحساب بنجاح",
        "user": user_data
    }), 201

@bp.route('/profile', methods=['GET'])
def get_profile():
    """الحصول على بيانات الملف الشخصي"""
    # في التطبيق الحقيقي، سيتم استخراج user_id من token
    user_id = request.args.get('user_id', type=int)
    
    if not user_id:
        return jsonify({"error": "معرف المستخدم مطلوب"}), 400
    
    user = next((u for u in users if u['id'] == user_id), None)
    
    if not user:
        return jsonify({"error": "المستخدم غير موجود"}), 404
    
    # إرجاع البيانات بدون كلمة المرور
    user_data = {k: v for k, v in user.items() if k != 'password'}
    
    return jsonify({
        "message": "بيانات الملف الشخصي",
        "user": user_data
    })

@bp.route('/verify', methods=['POST'])
def verify_token():
    """التحقق من صحة token"""
    token = request.headers.get('Authorization', '').replace('Bearer ', '')
    
    if not token:
        return jsonify({"error": "Token مطلوب"}), 401
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return jsonify({
            "message": "Token صالح",
            "valid": True,
            "user_id": payload['user_id'],
            "role": payload['role']
        })
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token منتهي الصلاحية"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Token غير صالح"}), 401

@bp.route('/roles')
def get_roles():
    """الحصول على الأدوار المتاحة"""
    roles = ['admin', 'lawyer', 'judge', 'client', 'witness']
    return jsonify({
        "message": "الأدوار المتاحة",
        "roles": roles
    })