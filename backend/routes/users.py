from flask import Blueprint, jsonify, request

# إنشاء Blueprint باسم 'users'
bp = Blueprint('users', __name__)

# تعريف routes
@bp.route('/')
def get_users():
    return jsonify({
        "message": "قائمة المستخدمين", 
        "users": [
            {"id": 1, "name": "محمد", "role": "محامي"},
            {"id": 2, "name": "أحمد", "role": "قاضي"},
            {"id": 3, "name": "خالد", "role": "موكل"}
        ]
    })

@bp.route('/<int:user_id>')
def get_user(user_id):
    return jsonify({
        "message": f"بيانات المستخدم {user_id}", 
        "user_id": user_id,
        "name": "مستخدم افتراضي",
        "role": "دور افتراضي"
    })

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    return jsonify({
        "message": "تم تسجيل مستخدم جديد", 
        "data": data,
        "status": "success"
    })

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    return jsonify({
        "message": "تم تسجيل الدخول", 
        "username": data.get('username'),
        "status": "success"
    })

@bp.route('/test')
def test():
    return jsonify({"message": "اختبار route المستخدمين", "status": "working"})