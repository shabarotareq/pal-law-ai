from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
import os

app = Flask(__name__)
CORS(app)

openai.api_key = os.getenv("OPENAI_API_KEY")

# مثال بيانات قضية
cases = {
    "CASE-2025-001": {
        "title": "القضية التجريبية",
        "participants": [
            {"id":"1","name":"القاضي أحمد","role":"judge"},
            {"id":"2","name":"المحامي علي","role":"lawyer"},
            {"id":"3","name":"المتهم محمد","role":"defendant"},
            {"id":"4","name":"الجمهور 1","role":"audience"}
        ]
    }
}

@app.route("/api/cases/<caseId>")
def get_case(caseId):
    case = cases.get(caseId)
    if not case:
        return jsonify({"error":"Case not found"}),404
    return jsonify(case)

# AI: تحليل القضية واقتراح حلول
@app.route("/api/ai/advise", methods=["POST"])
def ai_advise():
    data = request.json
    prompt = data.get("prompt","")
    if not prompt:
        return jsonify({"error":"No prompt"}),400
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role":"user","content":prompt}],
        temperature=0.5
    )
    return jsonify({"advice": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(port=5000, debug=True)

