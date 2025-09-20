import React, { useState, useEffect } from "react";
import { useLegalKnowledge } from "../../contexts/LegalKnowledgeContext";
import { legalKnowledgeApi } from "../../services/legalKnowledgeApi";
import LoadingSpinner from "../common/LoadingSpinner";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalLaws: 0,
    totalJudgments: 0,
    totalProcedures: 0,
    totalSearches: 0,
    totalChatSessions: 0,
    activeUsers: 0,
    popularCategories: [],
    dailyUsage: [],
  });

  const [timeRange, setTimeRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { searchResults } = useLegalKnowledge();

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // في التطبيق الحقيقي، سيتم جلب البيانات من API
      const mockData = {
        totalLaws: 1247,
        totalJudgments: 8563,
        totalProcedures: 342,
        totalSearches: 12894,
        totalChatSessions: 3456,
        activeUsers: 234,
        popularCategories: [
          { name: "مدني", count: 4567, percentage: 35 },
          { name: "جنائي", count: 3124, percentage: 24 },
          { name: "تجاري", count: 1987, percentage: 15 },
          { name: "إداري", count: 1564, percentage: 12 },
          { name: "أحوال شخصية", count: 987, percentage: 8 },
          { name: "عمل", count: 654, percentage: 5 },
        ],
        dailyUsage: [
          { date: "2024-01-01", searches: 123, chats: 45 },
          { date: "2024-01-02", searches: 156, chats: 52 },
          { date: "2024-01-03", searches: 198, chats: 67 },
          { date: "2024-01-04", searches: 176, chats: 58 },
          { date: "2024-01-05", searches: 210, chats: 72 },
          { date: "2024-01-06", searches: 187, chats: 63 },
          { date: "2024-01-07", searches: 234, chats: 89 },
        ],
      };

      setStats(mockData);

      // محاكاة تأخير الشبكة
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError("فشل في تحميل البيانات الإحصائية");
      setIsLoading(false);
      console.error("Error fetching analytics:", err);
    }
  };

  const StatCard = ({ title, value, icon, color, change }) => (
    <div
      className={`bg-white p-6 rounded-lg shadow border-l-4 ${color} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {value.toLocaleString()}
          </p>
          {change && (
            <p
              className={`text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "↑" : "↓"} {Math.abs(change)}% عن الشهر الماضي
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  const CategoryBar = ({ category, percentage, count }) => (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{category}</span>
        <span>
          {count.toLocaleString()} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="جاري تحميل الإحصائيات..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAnalyticsData}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* رأس الصفحة */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            لوحة التحليل والإحصائيات
          </h2>
          <p className="text-gray-600">نظرة عامة على أداء النظام واستخدامه</p>
        </div>

        <div className="mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7days">آخر 7 أيام</option>
            <option value="30days">آخر 30 يوم</option>
            <option value="90days">آخر 90 يوم</option>
            <option value="year">هذه السنة</option>
          </select>
        </div>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي القوانين"
          value={stats.totalLaws}
          icon="📚"
          color="border-l-blue-500"
          change={12}
        />
        <StatCard
          title="إجمالي الأحكام"
          value={stats.totalJudgments}
          icon="⚖️"
          color="border-l-green-500"
          change={8}
        />
        <StatCard
          title="إجمالي الإجراءات"
          value={stats.totalProcedures}
          icon="📋"
          color="border-l-purple-500"
          change={15}
        />
        <StatCard
          title="عمليات البحث"
          value={stats.totalSearches}
          icon="🔍"
          color="border-l-orange-500"
          change={23}
        />
        <StatCard
          title="جلسات المحادثة"
          value={stats.totalChatSessions}
          icon="💬"
          color="border-l-pink-500"
          change={18}
        />
        <StatCard
          title="المستخدمين النشطين"
          value={stats.activeUsers}
          icon="👥"
          color="border-l-teal-500"
          change={5}
        />
        <StatCard
          title="متوسط وقت الجلسة"
          value={4.2}
          icon="⏱️"
          color="border-l-indigo-500"
          change={-2}
          isDecimal={true}
        />
        <StatCard
          title="معدل الرضا"
          value={94}
          icon="⭐"
          color="border-l-yellow-500"
          change={3}
          isPercentage={true}
        />
      </div>

      {/* مخططات وإحصائيات متقدمة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* الفئات الأكثر شيوعاً */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            الفئات الأكثر بحثاً
          </h3>
          <div className="space-y-2">
            {stats.popularCategories.map((category, index) => (
              <CategoryBar
                key={index}
                category={category.name}
                percentage={category.percentage}
                count={category.count}
              />
            ))}
          </div>
        </div>

        {/* استخدام النظام اليومي */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            نشاط النظام اليومي
          </h3>
          <div className="space-y-3">
            {stats.dailyUsage.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium">
                  {new Date(day.date).toLocaleDateString("ar-SA")}
                </span>
                <div className="flex space-x-4">
                  <span className="text-sm text-blue-600">
                    🔍 {day.searches}
                  </span>
                  <span className="text-sm text-green-600">💬 {day.chats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold mb-4">إحصائيات سريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(stats.totalSearches / stats.activeUsers)}
            </div>
            <div className="text-sm">بحث/مستخدم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {(stats.totalChatSessions / stats.activeUsers).toFixed(1)}
            </div>
            <div className="text-sm">محادثة/مستخدم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {(stats.totalSearches / 7).toFixed(0)}
            </div>
            <div className="text-sm">بحث/يوم</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {(stats.totalChatSessions / 7).toFixed(0)}
            </div>
            <div className="text-sm">محادثة/يوم</div>
          </div>
        </div>
      </div>

      {/* آخر عمليات البحث */}
      {searchResults && searchResults.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            آخر عمليات البحث
          </h3>
          <div className="space-y-2">
            {searchResults.slice(0, 5).map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{result.query}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(result.timestamp).toLocaleString("ar-SA")}
                  </p>
                </div>
                <span className="text-sm text-green-600">
                  {result.resultsCount} نتيجة
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* أزرار التحكم */}
      <div className="flex space-x-4">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          تصدير التقرير
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          تحديث البيانات
        </button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">
          إعدادات التقارير
        </button>
      </div>
    </div>
  );
};

export default Analytics;
