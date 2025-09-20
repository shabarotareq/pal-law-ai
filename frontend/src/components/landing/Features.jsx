import React from "react";
import { Scale, Users, Cpu, Gavel } from "lucide-react";

const features = [
  {
    title: "محكمة افتراضية تفاعلية",
    description:
      "قم بمحاكاة الجلسات القضائية باستخدام VR/AR وذكاء اصطناعي لتوليد الردود والمرافعات.",
    icon: <Gavel className="w-10 h-10 text-yellow-400" />,
  },
  {
    title: "تحليل قانوني ذكي",
    description:
      "تحليل القضايا والقوانين باستخدام الذكاء الاصطناعي لتوفير استشارات دقيقة.",
    icon: <Cpu className="w-10 h-10 text-yellow-400" />,
  },
  {
    title: "إدارة المستخدمين والصلاحيات",
    description:
      "نظام متكامل لإدارة القضاة، المحامين، المدعين، والمتهمين ضمن بيئة آمنة.",
    icon: <Users className="w-10 h-10 text-yellow-400" />,
  },
  {
    title: "مكتبة القوانين واللوائح",
    description:
      "الوصول إلى قاعدة بيانات قانونية متجددة تغطي الأنظمة واللوائح المحلية والدولية.",
    icon: <Scale className="w-10 h-10 text-yellow-400" />,
  },
];

function Features() {
  return (
    <section className="bg-gray-100 py-16 px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        مميزات المنصة
      </h2>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
