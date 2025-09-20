import api from "./api";

export const legalKnowledgeApi = {
  search: async (query, filters = {}) => {
    const response = await api.post("/legal-knowledge/search", {
      query,
      filters,
    });
    return response.data;
  },

  getLaw: async (id) => {
    const response = await api.get(`/legal-knowledge/laws/${id}`);
    return response.data;
  },

  getJudgment: async (id) => {
    const response = await api.get(`/legal-knowledge/judgments/${id}`);
    return response.data;
  },

  getProcedure: async (id) => {
    const response = await api.get(`/legal-knowledge/procedures/${id}`);
    return response.data;
  },

  askLegalQuestion: async (question, context = null) => {
    const response = await api.post("/legal-knowledge/ask", {
      question,
      context,
    });
    return response.data;
  },

  addLaw: async (lawData) => {
    const response = await api.post("/legal-knowledge/laws", lawData);
    return response.data;
  },

  updateLaw: async (id, lawData) => {
    const response = await api.put(`/legal-knowledge/laws/${id}`, lawData);
    return response.data;
  },
};
