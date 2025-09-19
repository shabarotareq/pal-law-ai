from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, send, emit

# إنشاء تطبيق Flask واحد فقط
app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"

# تمكين CORS
CORS(app)

# تهيئة Socket.IO مع Flask
socketio = SocketIO(app, cors_allowed_origins="*")

# استيراد وتسجيل blueprints
from routes.users import bp as users_bp
from routes.cases import bp as cases_bp
from routes.documents import bp as documents_bp
from routes.auth import bp as auth_bp

app.register_blueprint(users_bp, url_prefix="/api/users")
app.register_blueprint(cases_bp, url_prefix="/api/cases")
app.register_blueprint(documents_bp, url_prefix="/api/documents")
app.register_blueprint(auth_bp, url_prefix="/api/auth")

# الروت الأساسي
@app.route('/')
def hello():
    return jsonify({
        "message": "مرحباً بك في PalLawAI!",
        "version": "1.0.0",
        "endpoints": {
            "users": "/api/users",
            "cases": "/api/cases",
            "documents": "/api/documents",
            "auth": "/api/auth"
        }
    })

@app.route('/api/status')
def status():
    return jsonify({"status": "active", "service": "PalLawAI Backend"})

# أحداث Socket.IO
@socketio.on("message")
def handle_message(msg):
    print("📩 رسالة:", msg)
    send(msg, broadcast=True)  # يبثها للجميع

# حدث لتبديل شخصية
@socketio.on("switch_avatar")
def handle_switch_avatar(data):
    print(f"🔄 تبديل شخصية: {data}")
    # يبث التغيير لكل المستخدمين الآخرين
    emit("update_avatar", data, broadcast=True, include_self=False)

if __name__ == '__main__':
    print("✅ تم تحميل جميع الـ blueprints وربط Socket.IO بنجاح")
    print("🚀 الخدمة تعمل على http://0.0.0.0:5000")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)

    # backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(__name__)
CORS(app)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["SECRET_KEY"] = "secret!"

socketio = SocketIO(app, cors_allowed_origins="*")

# رفع ملف glb
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(filepath)
    return jsonify({"path": f"/uploads/{file.filename}"}), 200

# إرسال الملفات المرفوعة
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# حدث تبديل شخصية
@socketio.on("switch_avatar")
def handle_switch(data):
    emit("update_avatar", data, broadcast=True, include_self=False)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
