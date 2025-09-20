import {
  OFFICIAL_SOURCES,
  PALESTINIAN_OFFICIAL_DOMAINS,
} from "../../utils/constants";

// تقييم مصداقية المصدر
export const evaluateSourceCredibility = (sourceInfo) => {
  let score = 0;
  const { url, content, author, publishDate } = sourceInfo;

  // تقييم النطاق
  score += evaluateDomain(url);

  // تقييم المحتوى
  score += evaluateContentQuality(content);

  // تقييم المؤلف/الناشر
  score += evaluateAuthor(author);

  // تقييم الحداثة
  score += evaluateFreshness(publishDate);

  return Math.max(1, Math.min(10, Math.round(score)));
};

// تقييم النطاق
const evaluateDomain = (url) => {
  if (!url) return 0;

  const domain = url.toLowerCase();

  // المصادر الرسمية الفلسطينية
  if (
    PALESTINIAN_OFFICIAL_DOMAINS.some((d) =>
      domain.includes(d.replace("*.", ""))
    )
  ) {
    return 10;
  }

  // المصادر الرسمية العامة
  if (OFFICIAL_SOURCES.some((source) => domain.includes(source))) {
    return 9;
  }

  // المواقع الأكاديمية
  if (domain.includes(".edu.") || domain.includes(".ac.")) {
    return 8;
  }

  // المنظمات غير الربحية
  if (domain.includes(".org")) {
    return 7;
  }

  // المواقع التجارية
  if (domain.includes(".com")) {
    return 5;
  }

  return 3;
};

// تقييم جودة المحتوى
const evaluateContentQuality = (content) => {
  if (!content) return 0;

  let score = 0;
  const text = content.toLowerCase();

  // وجود مراجع
  if (
    text.includes("مراجع") ||
    text.includes("مصادر") ||
    text.includes("reference")
  ) {
    score += 2;
  }

  // وجود تواريخ
  if (/\d{1,2}\/\d{1,2}\/\d{4}/.test(text) || /\d{4}/.test(text)) {
    score += 1;
  }

  // طول المحتوى
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 500) score += 2;
  else if (wordCount > 200) score += 1;

  // وجود مصطلحات قانونية
  const legalTerms = ["قانون", "مادة", "مرسوم", "قضية", "محكمة", "تشريع"];
  const foundTerms = legalTerms.filter((term) => text.includes(term));
  score += Math.min(3, foundTerms.length);

  return score;
};

// تقييم المؤلف
const evaluateAuthor = (author) => {
  if (!author) return 0;

  const authorStr = author.toLowerCase();

  if (
    authorStr.includes("محكمة") ||
    authorStr.includes("وزارة") ||
    authorStr.includes("حكومة")
  ) {
    return 3;
  }

  if (
    authorStr.includes("دكتور") ||
    authorStr.includes("أستاذ") ||
    authorStr.includes("بروفيسور")
  ) {
    return 2;
  }

  return 1;
};

// تقييم الحداثة
const evaluateFreshness = (publishDate) => {
  if (!publishDate) return 0;

  try {
    const publishTime = new Date(publishDate).getTime();
    const currentTime = new Date().getTime();
    const diffYears = (currentTime - publishTime) / (1000 * 60 * 60 * 24 * 365);

    if (diffYears < 1) return 3;
    if (diffYears < 3) return 2;
    if (diffYears < 5) return 1;
    return 0;
  } catch {
    return 0;
  }
};
