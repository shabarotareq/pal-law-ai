from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # تمكين CORS لجميع domains

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

if __name__ == '__main__':
    print("✅ تم تحميل جميع الـ blueprints بنجاح")
    app.run(debug=True, host='0.0.0.0', port=5000)