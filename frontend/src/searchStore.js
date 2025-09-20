import { create } from "zustand";
import { useOnlineSearch } from "../hooks/useOnlineSearch";

const useSearchStore = create((set, get) => ({
  // State
  query: "",
  results: [],
  localDocuments: [],
  isSearching: false,
  error: null,
  searchSettings: {
    useOnlineSearch: true,
    maxResults: 10,
    minCredibility: 5,
    jurisdiction: "ps",
  },

  // Actions
  setQuery: (query) => set({ query }),

  setSearchSettings: (settings) =>
    set({
      searchSettings: { ...get().searchSettings, ...settings },
    }),

  setLocalDocuments: (documents) => set({ localDocuments: documents }),

  performSearch: async (query = null) => {
    const actualQuery = query || get().query;
    if (!actualQuery.trim()) return;

    set({ isSearching: true, error: null });

    try {
      const { search } = useOnlineSearch();
      const results = await search(
        actualQuery,
        get().localDocuments,
        get().searchSettings
      );

      set({ results, isSearching: false });
    } catch (error) {
      set({ error: error.message, isSearching: false });
    }
  },

  clearResults: () => set({ results: [], error: null }),
}));

export default useSearchStore;
