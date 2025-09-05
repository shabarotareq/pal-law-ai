import React from "react";

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-6 text-center">
      <p className="mb-2">
        © {new Date().getFullYear()} عدالة AI - جميع الحقوق محفوظة
      </p>
      <p className="text-sm">
        تطوير بواسطة فريق <span className="text-yellow-400">Pal-Law-AI</span>
      </p>
    </footer>
  );
}

export default Footer;
