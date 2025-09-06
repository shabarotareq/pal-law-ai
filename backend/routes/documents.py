from flask import Blueprint, jsonify, request

bp = Blueprint('documents', __name__)

# قائمة المستندات الافتراضية
documents = [
    {
        "id": 1,
        "title": "عقد الاتفاقية",
        "description": "العقد الأساسي بين الأطراف",
        "type": "عقد",
        "case_id": 1,
        "upload_date": "2023-01-20",
        "file_size": "2.5 MB",
        "uploaded_by": "المحامي محمد",
        "url": "/documents/contract_001.pdf"
    },
    {
        "id": 2,
        "title": "مذكرة الدفاع",
        "description": "مذكرة الدفاع الأولية",
        "type": "مذكرة",
        "case_id": 1,
        "upload_date": "2023-02-15",
        "file_size": "1.8 MB",
        "uploaded_by": "المحامي خالد",
        "url": "/documents/memo_001.pdf"
    },
    {
        "id": 3,
        "title": "تقارير الخبراء",
        "description": "تقارير الخبراء الفنيين",
        "type": "تقرير",
        "case_id": 2,
        "upload_date": "2023-03-10",
        "file_size": "4.2 MB",
        "uploaded_by": "المحامي علي",
        "url": "/documents/expert_001.pdf"
    }
]

@bp.route('/')
def get_documents():
    """الحصول على قائمة جميع المستندات"""
    return jsonify({
        "message": "قائمة المستندات",
        "count": len(documents),
        "documents": documents
    })

@bp.route('/<int:doc_id>')
def get_document(doc_id):
    """الحصول على مستند محدد"""
    document = next((d for d in documents if d['id'] == doc_id), None)
    if document:
        return jsonify({
            "message": f"بيانات المستند {doc_id}",
            "document": document
        })
    return jsonify({"error": "المستند غير موجود"}), 404

@bp.route('/', methods=['POST'])
def upload_document():
    """رفع مستند جديد"""
    data = request.get_json()
    
    new_document = {
        "id": len(documents) + 1,
        "title": data.get('title', ''),
        "description": data.get('description', ''),
        "type": data.get('type', 'مستند'),
        "case_id": data.get('case_id'),
        "upload_date": data.get('upload_date', '2023-01-01'),
        "file_size": data.get('file_size', '0 MB'),
        "uploaded_by": data.get('uploaded_by', 'مستخدم'),
        "url": data.get('url', f"/documents/doc_{len(documents) + 1}.pdf")
    }
    
    documents.append(new_document)
    return jsonify({
        "message": "تم رفع المستند بنجاح",
        "document": new_document
    }), 201

@bp.route('/case/<int:case_id>')
def get_case_documents(case_id):
    """الحصول على مستندات قضية محددة"""
    case_docs = [d for d in documents if d['case_id'] == case_id]
    return jsonify({
        "message": f"مستندات القضية {case_id}",
        "count": len(case_docs),
        "documents": case_docs
    })

@bp.route('/types')
def get_document_types():
    """الحصول على أنواع المستندات المتاحة"""
    types = list(set(doc['type'] for doc in documents))
    return jsonify({
        "message": "أنواع المستندات",
        "types": types
    })

@bp.route('/search')
def search_documents():
    """بحث في المستندات"""
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "يرجى تقديم كلمة بحث"}), 400
    
    results = [
        d for d in documents 
        if query.lower() in d['title'].lower() 
        or query.lower() in d['description'].lower()
        or query.lower() in d['type'].lower()
    ]
    
    return jsonify({
        "message": f"نتائج البحث عن: {query}",
        "count": len(results),
        "documents": results
    })