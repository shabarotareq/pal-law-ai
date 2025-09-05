import React from "react";

const Statistics = ({ stats }) => {
  return (
    <section className="container">
      <h2 className="section-title">إحصائيات النظام</h2>
      <p className="section-subtitle">
        أرقام وحقائق تعكس جودة ومدى تأثير منصتنا في خدمة القانون الفلسطيني
      </p>

      <div className="stats-container">
        <div className="stat">
          <div className="stat-number">{stats.judgments.toLocaleString()}</div>
          <div className="stat-label">عدد الأحكام القضائية</div>
        </div>

        <div className="stat">
          <div className="stat-number">
            {stats.activeUsers.toLocaleString()}
          </div>
          <div className="stat-label">عدد المستخدمين النشطين</div>
        </div>

        <div className="stat">
          <div className="stat-number">{stats.accuracy}%</div>
          <div className="stat-label">نسبة دقة التحليل</div>
        </div>
      </div>

      <div className="services">خدماتنا متاحة على مدار الساعة 24/7</div>
    </section>
  );
};

export default Statistics;
