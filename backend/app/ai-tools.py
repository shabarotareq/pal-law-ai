import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def analyze_case(text: str):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": f"حلل القضية التالية: {text}"}]
    )
    return response.choices[0].message.content
