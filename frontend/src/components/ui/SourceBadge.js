import React from "react";

const SourceBadge = ({ sourceType, isOfficial, credibility }) => {
  const getBadgeConfig = () => {
    if (sourceType === "local") {
      return {
        text: "وثيقة محلية",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
      };
    }

    if (isOfficial) {
      return {
        text: "مصدر رسمي",
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
      };
    }

    if (credibility >= 7) {
      return {
        text: "موثوق",
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
      };
    }

    return {
      text: "مصدر خارجي",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
    };
  };

  const { text, bgColor, textColor } = getBadgeConfig();

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {text}
    </span>
  );
};

export default SourceBadge;
