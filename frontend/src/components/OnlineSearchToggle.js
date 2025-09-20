import React from "react";
import useSearchStore from "../../stores/searchStore";

const OnlineSearchToggle = () => {
  const { searchSettings, setSearchSettings } = useSearchStore();

  const handleToggle = () => {
    setSearchSettings({
      useOnlineSearch: !searchSettings.useOnlineSearch,
    });
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={searchSettings.useOnlineSearch}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
      <span className="text-sm font-medium text-gray-900">
        البحث عبر الإنترنت
      </span>
      <span className="text-xs text-gray-500">
        {searchSettings.useOnlineSearch ? "مفعل" : "معطل"}
      </span>
    </div>
  );
};

export default OnlineSearchToggle;
