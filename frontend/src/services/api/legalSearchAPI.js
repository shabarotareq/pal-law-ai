import { searchOnlineForLaws, searchLegalDatabases } from "./webSearchAPI";
import {
  searchInDocument,
  chunkTextForSearch,
} from "../processing/documentProcessor";
import {
  integrateResults,
  generateUnifiedResponse,
} from "../processing/resultIntegrator";

// البحث الهجين الرئيسي
export const hybridLegalSearch = async (
  query,
  localDocuments = [],
  options = {}
) => {
  try {
    const { useOnlineSearch = true, maxResults = 10 } = options;

    // البحث في المصادر المحلية
    const localResults = await searchLocalDocuments(query, localDocuments);

    let onlineResults = [];

    // البحث في المصادر الخارجية إذا كان مفعلاً
    if (useOnlineSearch) {
      onlineResults = await searchOnlineForLaws(query, { count: maxResults });
    }

    // دمج النتائج
    const integratedResults = integrateResults(
      onlineResults,
      localResults,
      query
    );

    // توليد الاستجابة
    return generateUnifiedResponse(integratedResults, query);
  } catch (error) {
    console.error("Error in hybrid legal search:", error);
    throw new Error(`فشل في البحث: ${error.message}`);
  }
};

// البحث في الوثائق المحلية
const searchLocalDocuments = async (query, documents) => {
  const results = [];

  for (const doc of documents) {
    try {
      const matches = searchInDocument(doc.text, query);

      matches.forEach((match) => {
        results.push({
          title: `نتيجة من ${doc.name || "وثيقة محلية"}`,
          content: match.context,
          description: `مطابقة في الوثيقة المحلية: ${match.match}`,
          url: null,
          sourceType: "local",
          isOfficial: true, // تعتبر الوثائق المقدمة رسمية
          credibility: 9,
          matchPosition: match.position,
        });
      });
    } catch (error) {
      console.error(`Error searching in document ${doc.name}:`, error);
    }
  }

  return results;
};

// البحث المتقدم مع المرشحات
export const advancedLegalSearch = async (query, filters = {}) => {
  const {
    jurisdiction = "ps",
    documentType,
    category,
    dateRange,
    minCredibility = 5,
  } = filters;

  let searchQuery = query;

  // إضافة المرشحات إلى query
  if (jurisdiction) searchQuery += ` ${jurisdiction}`;
  if (documentType) searchQuery += ` ${documentType}`;
  if (category) searchQuery += ` ${category}`;

  const results = await searchOnlineForLaws(searchQuery);

  // تطبيق المرشحات الإضافية
  return results.filter((result) => {
    if (result.credibility < minCredibility) return false;

    if (dateRange) {
      const resultDate = new Date(result.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      if (resultDate < startDate || resultDate > endDate) return false;
    }

    return true;
  });
};

// الحصول على معلومات عن مصدر
export const getSourceInfo = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LegalResearchBot/1.0)",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    return {
      title: $("title").text() || "",
      description: $('meta[name="description"]').attr("content") || "",
      author: $('meta[name="author"]').attr("content") || "",
      publishDate:
        $('meta[property="article:published_time"]').attr("content") || "",
      keywords: $('meta[name="keywords"]').attr("content") || "",
    };
  } catch (error) {
    console.error("Error fetching source info:", error);
    return {};
  }
};
