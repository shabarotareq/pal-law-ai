import React, { createContext, useContext, useReducer } from "react";
import { legalKnowledgeApi } from "../services/legalKnowledgeApi";

// إنشاء Context
const LegalKnowledgeContext = createContext();

// الحالة الابتدائية
const initialState = {
  laws: [],
  judgments: [],
  procedures: [],
  searchResults: [],
  isLoading: false,
  error: null,
  currentQuery: "",
  filters: {
    category: null,
    dateRange: null,
    courtLevel: null,
    type: "all", // "all", "laws", "judgments", "procedures"
  },
};

// Reducer لإدارة الحالة
function legalKnowledgeReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload, isLoading: false };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case "CLEAR_RESULTS":
      return { ...state, searchResults: [], currentQuery: "" };
    default:
      return state;
  }
}

// Provider
export function LegalKnowledgeProvider({ children }) {
  const [state, dispatch] = useReducer(legalKnowledgeReducer, initialState);

  /**
   * البحث في قاعدة المعرفة القانونية
   * @param {string} query نص البحث
   * @param {object} filters فلاتر إضافية
   */
  const searchLegalKnowledge = async (query, filters = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      if (!legalKnowledgeApi || !legalKnowledgeApi.search) {
        throw new Error("API غير متاح حاليا");
      }
      const combinedFilters = { ...state.filters, ...filters };
      const results = await legalKnowledgeApi.search(query, combinedFilters);
      dispatch({ type: "SET_SEARCH_RESULTS", payload: results });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error?.message || "حدث خطأ أثناء البحث",
      });
    }
  };

  // جلب قانون بواسطة ID
  const getLawById = async (id) => {
    try {
      if (!legalKnowledgeApi?.getLaw) return null;
      return await legalKnowledgeApi.getLaw(id);
    } catch (error) {
      console.error("Error fetching law:", error);
      return null;
    }
  };

  // جلب حكم بواسطة ID
  const getJudgmentById = async (id) => {
    try {
      if (!legalKnowledgeApi?.getJudgment) return null;
      return await legalKnowledgeApi.getJudgment(id);
    } catch (error) {
      console.error("Error fetching judgment:", error);
      return null;
    }
  };

  // جلب إجراء بواسطة ID
  const getProcedureById = async (id) => {
    try {
      if (!legalKnowledgeApi?.getProcedure) return null;
      return await legalKnowledgeApi.getProcedure(id);
    } catch (error) {
      console.error("Error fetching procedure:", error);
      return null;
    }
  };

  const value = {
    ...state,
    searchLegalKnowledge,
    getLawById,
    getJudgmentById,
    getProcedureById,
    setFilters: (filters) =>
      dispatch({ type: "SET_FILTERS", payload: filters }),
    clearResults: () => dispatch({ type: "CLEAR_RESULTS" }),
  };

  return (
    <LegalKnowledgeContext.Provider value={value}>
      {children}
    </LegalKnowledgeContext.Provider>
  );
}

// Hook للاستخدام داخل المكونات
export const useLegalKnowledge = () => {
  const context = useContext(LegalKnowledgeContext);
  if (!context) {
    throw new Error(
      "useLegalKnowledge must be used within a LegalKnowledgeProvider"
    );
  }
  return context;
};
