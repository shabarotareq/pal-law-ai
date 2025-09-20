import axios from "axios";
import * as cheerio from "cheerio";
import {
  OFFICIAL_SOURCES,
  PALESTINIAN_OFFICIAL_DOMAINS,
} from "../../utils/constants";

// تكوين قاعدة للبحث القانوني
const LEGAL_SEARCH_CONFIG = {
  baseURL: "https://api.search.brave.com/res/v1/web/search",
  headers: {
    "X-Subscription-Token": process.env.REACT_APP_BRAVE_API_KEY,
  },
  params: {
    country: "ps",
    search_lang: "ar",
    result_filter: "web",
  },
};

// تكوين axios instance للبحث
const legalSearchAPI = axios.create(LEGAL_SEARCH_CONFIG);

// استخراج النص من HTML
const extractTextFromHTML = (html) => {
  try {
    const $ = cheerio.load(html);
    // إزالة العناصر غير المرغوب فيها
    $("script, style, nav, footer, header").remove();
    return $("body").text().replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error("Error extracting text from HTML:", error);
    return "";
  }
};

// البحث على الإنترنت عن معلومات قانونية
export const searchOnlineForLaws = async (query, options = {}) => {
  try {
    const { count = 5, includeInternal = true } = options;

    const response = await legalSearchAPI.get("", {
      params: {
        q: `${query} قانون فلسطين`,
        count,
        freshness: options.freshness || "pm", // شهر واحد
      },
    });

    const results = response.data.web.results.map((result) => ({
      title: result.title,
      url: result.url,
      description: result.description,
      content: extractTextFromHTML(result.html || ""),
      source: getSourceType(result.url),
      credibility: evaluateCredibility(result.url, result.description),
      date: result.date || new Date().toISOString(),
      isOfficial: isOfficialSource(result.url),
    }));

    return prioritizeResults(results);
  } catch (error) {
    console.error("Error in online legal search:", error);
    throw new Error("فشل في البحث على الإنترنت. يرجى التحقق من اتصال الشبكة.");
  }
};

// تحديد نوع المصدر
const getSourceType = (url) => {
  if (url.includes("court") || url.includes("judiciary")) return "court";
  if (url.includes("ministry") || url.includes("gov")) return "government";
  if (url.includes("law") || url.includes("legal")) return "legal_portal";
  if (url.includes("academic") || url.includes("edu")) return "academic";
  return "general";
};

// تقييم مصداقية المصدر
const evaluateCredibility = (url, content) => {
  let score = 0;

  // زيادة النقاط للمصادر الرسمية
  if (isOfficialSource(url)) score += 10;

  // زيادة النقاط للمواقع الأكاديمية
  if (url.includes(".edu.") || url.includes(".ac.")) score += 8;

  // زيادة النقاط للمواقع القانونية المتخصصة
  if (url.includes("law") || url.includes("legal")) score += 7;

  // تقليل النقاط للمواقع التجارية
  if (url.includes(".com")) score -= 2;

  // التحقق من وجود معلومات اتصال
  if (content.includes("@") || content.includes("اتصل")) score += 3;

  return Math.max(1, Math.min(10, score));
};

// التحقق إذا كان المصدر رسمي
const isOfficialSource = (url) => {
  return (
    OFFICIAL_SOURCES.some((source) => url.includes(source)) ||
    PALESTINIAN_OFFICIAL_DOMAINS.some((domain) =>
      url.includes(domain.replace("*.", ""))
    )
  );
};

// إعطاء أولوية للمصادر الرسمية
const prioritizeResults = (results) => {
  return results.sort((a, b) => {
    if (a.isOfficial && !b.isOfficial) return -1;
    if (!a.isOfficial && b.isOfficial) return 1;
    return b.credibility - a.credibility;
  });
};

// البحث في قواعد البيانات القانونية المتخصصة
export const searchLegalDatabases = async (
  legalConcept,
  jurisdiction = "ps"
) => {
  try {
    // يمكن التكامل مع قواعد بيانات قانونية متخصصة هنا
    const responses = await Promise.allSettled([
      searchOnlineForLaws(`${legalConcept} ${jurisdiction}`),
      // إضافة المزيد من مصادر قواعد البيانات هنا
    ]);

    const successfulResults = responses
      .filter((response) => response.status === "fulfilled")
      .map((response) => response.value)
      .flat();

    return successfulResults;
  } catch (error) {
    console.error("Error searching legal databases:", error);
    return [];
  }
};
