import React from "react";
import Chatbot from "./ChatBot";

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h2>مساعدك القانوني الذكي</h2>
          <p>
            احصل على تحليل قانوني دقيق وأحكام مشابهة باستخدام الذكاء الاصطناعي
            المتقدم والمحكمة الافتراضية
          </p>
          <Chatbot />
        </div>
      </div>
    </section>
  );
};

export default Hero;
