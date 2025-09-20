import { useState, useCallback } from "react";
import {
  hybridLegalSearch,
  advancedLegalSearch,
} from "../services/api/legalSearchAPI";

export const useOnlineSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const search = useCallback(
    async (query, localDocuments = [], options = {}) => {
      setIsSearching(true);
      setError(null);

      try {
        const searchResults = await hybridLegalSearch(
          query,
          localDocuments,
          options
        );
        setResults(searchResults);
        return searchResults;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  const advancedSearch = useCallback(async (query, filters = {}) => {
    setIsSearching(true);
    setError(null);

    try {
      const searchResults = await advancedLegalSearch(query, filters);
      setResults(searchResults);
      return searchResults;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    advancedSearch,
    clearResults,
    isSearching,
    results,
    error,
  };
};
