import React from "react";

const LawCategories = () => {
  return (
    <section className="container">
      <h2 className="section-title">أقسام القانون الفلسطيني</h2>
      <p className="section-subtitle">
        استكشف أقسام القانون الفلسطيني المختلفة واحصل على المعلومات الدقيقة من
        خلال منصتنا
      </p>

      <div className="blocks-container">
        <div className="block">
          <div className="block-header">
            <span className="block-icon">🔍</span>
            <h3>أقسام القانون الفلسطيني</h3>
          </div>
          <ul className="law-categories">
            <li>
              <i className="fas fa-arrow-left"></i> القانون الجنائي / الجرائم
              والعقوبات
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> الأحوال المدنية / الحقوق
              المدنية
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> القانون الشرعي / الأحوال
              الشخصية
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> قوانين العمل / حقوق العمال
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> الجرائم الإلكترونية / الأمن
              السيبراني
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> الضرائب والمالية / القوانين
              المالية
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> المراسيم بقانون / الإجراءات
              والتعليمات والمراسيم الرئاسية
            </li>
          </ul>
        </div>

        <div className="block">
          <div className="block-header">
            <span className="block-icon">🤖</span>
            <h3>أدوات الذكاء الاصطناعي</h3>
          </div>
          <ul className="ai-tools">
            <li>
              <i className="fas fa-arrow-left"></i> البحث الذكي / ابحث في آلاف
              الأحكام والقوانين بالذكاء الاصطناعي
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> تحليل الوثائق / حلل الوثائق
              القانونية واستخرج النقاط المهمة
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> تقييم القضية / احصل على
              تقييم احتمالية نجاح القضية
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> كتابة المرافعات / مساعد ذكي
              لكتابة المرافعات القانونية
            </li>
            <li>
              <i className="fas fa-arrow-left"></i> تدريبات قانونية / احصل على
              تدريب في العالم الافتراضي
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default LawCategories;
