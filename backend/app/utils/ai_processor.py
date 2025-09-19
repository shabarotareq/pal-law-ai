import openai
import os
from models import LawDocument, db
from sqlalchemy import or_

class AIProcessor:
    def __init__(self, api_key=None):
        """
        تهيئة معالج الذكاء الاصطناعي.
        يمكن تمرير api_key مباشرة أو الاعتماد على متغير البيئة OPENAI_API_KEY.
        """
        self.api_key = api_key or os.environ.get('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')
        if not self.api_key:
            raise ValueError("⚠️ OpenAI API Key is required. Set it in code or environment variables.")
        openai.api_key = self.api_key

    def process_message(self, message):
        """
        معالجة الرسالة باستخدام الذكاء الاصطناعي.
        تدمج نتائج البحث في قاعدة البيانات إذا وجدت وثائق ذات صلة.
        """
        try:
            # البحث في قاعدة البيانات أولاً
            relevant_docs = self.search_in_database(message)

            if relevant_docs:
                context = "\n".join([doc.content[:500] for doc in relevant_docs[:3]])
                prompt = f"""
                بناءً على القوانين الفلسطينية التالية:
                {context}

                أجب على السؤال التالي: {message}

                قدم إجابة قانونية دقيقة مع الإشارة إلى القوانين ذات الصلة إن أمكن.
                """
            else:
                prompt = f"""
                كمساعد قانوني ذكي، أجب على السؤال التالي حول القانون الفلسطيني: {message}

                إذا لم تكن متأكداً من الإجابة، قل أنك لا تعرف بدلاً من تقديم معلومات غير دقيقة.
                """

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful legal assistant specialized in Palestinian law."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500
            )

            return response.choices[0].message['content']

        except Exception as e:
            print(f"Error in AI processing: {e}")
            return "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً."

    def search_in_database(self, query):
        """
        البحث في قاعدة البيانات عن القوانين ذات الصلة.
        """
        try:
            results = LawDocument.query.filter(
                or_(
                    LawDocument.title.ilike(f'%{query}%'),
                    LawDocument.content.ilike(f'%{query}%'),
                    LawDocument.keywords.ilike(f'%{query}%')
                )
            ).limit(5).all()

            return results
        except Exception as e:
            print(f"Database search error: {e}")
            return []

    def search_laws(self, query):
        """
        البحث المتقدم في القوانين وإرجاع النتائج كقاموس.
        """
        results = self.search_in_database(query)
        return [doc.to_dict() for doc in results]

