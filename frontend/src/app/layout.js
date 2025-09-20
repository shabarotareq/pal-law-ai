// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "عدالة AI | Palestine Law AI",
  description: "منصة تجمع القوانين والقرارات القضائية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* ✅ تحميل الخطوط من Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Amiri:wght@400;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
