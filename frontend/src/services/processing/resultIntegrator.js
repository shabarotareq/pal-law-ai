import { evaluateCredibility } from "./sourceEvaluator";

// دمج النتائج من مصادر مختلفة
export const integrateResults = (onlineResults, localResults, query) => {
  const allResults = [
    ...onlineResults.map((result) => ({
      ...result,
      sourceType: "online",
      score: calculateRelevanceScore(result, query),
    })),
    ...localResults.map((result) => ({
      ...result,
      sourceType: "local",
      score: calculateRelevanceScore(result, query),
    })),
  ];

  // ترتيب النتائج حسب الصلة والمصداقية
  return allResults.sort((a, b) => {
    // الأولوية للنتائج عالية الصلة والمصداقية
    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;

    // ثم الأولوية للمصادر الرسمية
    if (a.isOfficial && !b.isOfficial) return -1;
    if (!a.isOfficial && b.isOfficial) return 1;

    // ثم المصداقية
    return b.credibility - a.credibility;
  });
};

// حساب درجة الصلة
const calculateRelevanceScore = (result, query) => {
  const queryTerms = query.toLowerCase().split(/\s+/);
  const content =
    `${result.title} ${result.description} ${result.content}`.toLowerCase();

  let score = 0;

  // مطابقة كل مصطلح
  queryTerms.forEach((term) => {
    if (content.includes(term)) {
      score += 5;

      // زيادة النقاط إذا كان المصطلح في العنوان
      if (result.title.toLowerCase().includes(term)) {
        score += 10;
      }
    }
  });

  // إضافة نقاط المصداقية
  score += result.credibility || 0;

  // نقاط إضافية للمصادر الرسمية
  if (result.isOfficial) {
    score += 15;
  }

  // نقاط إضافية للمصادر المحلية
  if (result.sourceType === "local") {
    score += 20;
  }

  return score;
};

// توليد إجابة موحدة
export const generateUnifiedResponse = (integratedResults, query) => {
  if (integratedResults.length === 0) {
    return {
      answer: "لم يتم العثور على نتائج لاستفسارك.",
      sources: [],
      confidence: 0,
    };
  }

  const topResults = integratedResults.slice(0, 3);
  const confidence = calculateOverallConfidence(topResults);

  const answer = compileAnswerFromResults(topResults, query);
  const sources = topResults.map((result) => ({
    title: result.title,
    url: result.url,
    sourceType: result.sourceType,
    credibility: result.credibility,
    isOfficial: result.isOfficial,
  }));

  return {
    answer,
    sources,
    confidence,
    totalResults: integratedResults.length,
    disclaimer:
      "يجب التحقق من المعلومات مع مصادر رسمية للتأكد من دقتها وحداثتها",
  };
};

// تجميع الإجابة من النتائج
const compileAnswerFromResults = (results, query) => {
  let answer = `بناءً على البحث عن "${query}"، إليك المعلومات المتاحة:\n\n`;

  results.forEach((result, index) => {
    answer += `${index + 1}. ${result.title}\n`;
    answer += `${truncateText(result.description || result.content, 200)}\n\n`;

    if (result.sourceType === "online") {
      answer += `المصدر: ${getDomainFromUrl(result.url)} (${
        result.isOfficial ? "مصدر رسمي" : "مصدر خارجي"
      })\n\n`;
    } else {
      answer += `المصدر: الوثيقة المقدمة\n\n`;
    }
  });

  return answer;
};

// حساب الثقة العامة
const calculateOverallConfidence = (results) => {
  if (results.length === 0) return 0;

  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const maxPossibleScore = results.length * 100; // تقدير أقصى درجة
  const confidence = (totalScore / maxPossibleScore) * 100;

  return Math.min(100, Math.round(confidence));
};

//截断 النص
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// استخراج النطاق من URL
const getDomainFromUrl = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return url;
  }
};
