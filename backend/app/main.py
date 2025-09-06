from fastapi import FastAPI
from . import models, database, ai_tools

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="عدالة AI")

@app.get("/")
def root():
    return {"message": "مرحباً بك في عدالة AI 🚀"}

@app.post("/analyze_case")
def analyze_case(case_text: str):
    return {"analysis": ai_tools.analyze_case(case_text)}
