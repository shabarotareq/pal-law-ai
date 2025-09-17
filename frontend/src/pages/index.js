// pages/index.js
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

export default function HomePage({ lang, setLang }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-grow">
        <main className="flex-grow p-4 md:p-6 lg:p-8 relative homepage">
          <div className="herosection bg-white rounded-lg p-6 shadow-md mb-6 text-center">
            <h1 className="text-3xl font-bold mb-4">
              {lang === "ar" ? "مرحبا بكم في موقعنا" : "Welcome to our website"}
            </h1>
            <p className="mb-6">
              {lang === "ar"
                ? "هذا هو القسم الرئيسي للصفحة."
                : "This is the main section of the page."}
            </p>
          </div>

          <div className="content-below">
            <p>
              {lang === "ar"
                ? "هنا باقي محتوى الصفحة الرئيسية يظهر بشكل طبيعي."
                : "Here is the rest of the homepage content displayed normally."}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
