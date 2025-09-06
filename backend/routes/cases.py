from flask import Blueprint, jsonify, request

bp = Blueprint('cases', __name__)

# قائمة القضايا الافتراضية
cases = [
    {
        "id": 1,
        "case_number": "CL-2023-001",
        "title": "قضية تعاقدية",
        "description": "نزاع على عقد توريد مواد بناء",
        "status": "جارية",
        "court": "محكمة بداية رام الله",
        "judge": "القاضي أحمد",
        "lawyers": ["المحامي محمد", "المحامي خالد"],
        "parties": ["شركة الأفق للمقاولات", "مؤسسة النور للبناء"],
        "start_date": "2023-01-15",
        "next_hearing": "2023-12-10"
    },
    {
        "id": 2,
        "case_number": "CL-2023-002",
        "title": "قضية تعويض",
        "description": "مطالبة بتعويض عن أضرار",
        "status": "منتهية",
        "court": "محكمة بداية الخليل",
        "judge": "القاضي سليم",
        "lawyers": ["المحامي علي", "المحامي حسن"],
        "parties": ["مواطن أ", "شركة ب"],
        "start_date": "2023-02-20",
        "end_date": "2023-10-05",
        "result": "حكم لصالح المدعي بتعويض 5000 دينار"
    }
]

@bp.route('/')
def get_cases():
    """الحصول على قائمة جميع القضايا"""
    return jsonify({
        "message": "قائمة القضايا",
        "count": len(cases),
        "cases": cases
    })

@bp.route('/<int:case_id>')
def get_case(case_id):
    """الحصول على قضية محددة"""
    case = next((c for c in cases if c['id'] == case_id), None)
    if case:
        return jsonify({
            "message": f"بيانات القضية {case_id}",
            "case": case
        })
    return jsonify({"error": "القضية غير موجودة"}), 404

@bp.route('/', methods=['POST'])
def create_case():
    """إنشاء قضية جديدة"""
    data = request.get_json()
    
    new_case = {
        "id": len(cases) + 1,
        "case_number": data.get('case_number', f"CL-2023-{len(cases) + 1:03d}"),
        "title": data.get('title', ''),
        "description": data.get('description', ''),
        "status": data.get('status', 'جديدة'),
        "court": data.get('court', ''),
        "judge": data.get('judge', ''),
        "lawyers": data.get('lawyers', []),
        "parties": data.get('parties', []),
        "start_date": data.get('start_date', ''),
        "next_hearing": data.get('next_hearing', '')
    }
    
    cases.append(new_case)
    return jsonify({
        "message": "تم إنشاء القضية بنجاح",
        "case": new_case
    }), 201

@bp.route('/<int:case_id>', methods=['PUT'])
def update_case(case_id):
    """تحديث بيانات قضية"""
    data = request.get_json()
    case = next((c for c in cases if c['id'] == case_id), None)
    
    if not case:
        return jsonify({"error": "القضية غير موجودة"}), 404
    
    # تحديث الحقول المتاحة
    for key in ['title', 'description', 'status', 'court', 'judge', 'lawyers', 'parties', 'next_hearing']:
        if key in data:
            case[key] = data[key]
    
    return jsonify({
        "message": f"تم تحديث القضية {case_id}",
        "case": case
    })

@bp.route('/status/<status>')
def get_cases_by_status(status):
    """الحصول على القضايا حسب الحالة"""
    filtered_cases = [c for c in cases if c['status'].lower() == status.lower()]
    return jsonify({
        "message": f"القضايا ذات الحالة: {status}",
        "count": len(filtered_cases),
        "cases": filtered_cases
    })

@bp.route('/search')
def search_cases():
    """بحث في القضايا"""
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "يرجى تقديم كلمة بحث"}), 400
    
    results = [
        c for c in cases 
        if query.lower() in c['title'].lower() 
        or query.lower() in c['description'].lower()
        or query.lower() in c['case_number'].lower()
    ]
    
    return jsonify({
        "message": f"نتائج البحث عن: {query}",
        "count": len(results),
        "cases": results
    })