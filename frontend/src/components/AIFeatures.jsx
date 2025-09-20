import React from "react";

const AIFeatures = () => {
  return (
    <section className="container">
      <h2 className="section-title">ميزات الذكاء الاصطناعي</h2>
      <p className="section-subtitle">
        اكتشف القوة الكاملة للذكاء الاصطناعي في تحليل وتفسير القوانين الفلسطينية
      </p>

      <div className="blocks-container">
        <div className="block">
          <div className="block-header">
            <span className="block-icon">📊</span>
            <h3>تحليل الوثائق القانونية</h3>
          </div>
          <p>
            قم بتحميل وثائقك القانونية واحصل على تحليل مفصل للنقاط الرئيسية
            والثغرات المحتملة، مع اقتراحات لتحسينها بناءً على القوانين
            الفلسطينية ذات الصلة.
          </p>
        </div>

        <div className="block">
          <div className="block-header">
            <span className="block-icon">🔎</span>
            <h3>البحث المتقدم في القضاء</h3>
          </div>
          <p>
            ابحث في آلاف الأحكام القضائية والقوانين باستخدام محرك بحث ذكي يعتمد
            على الذكاء الاصطناعي، مع إمكانية التصفية حسب النوع، التاريخ،
            والمحكمة.
          </p>
        </div>

        <div className="block">
          <div className="block-header">
            <span className="block-icon">📝</span>
            <h3>إنشاء المستندات القانونية</h3>
          </div>
          <p>
            أنشئ مستندات قانونية دقيقة باستخدام قوالب ذكية تتكيف مع حالتك
            الخاصة، مع ضمان التوافق الكامل مع التشريعات الفلسطينية.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;
