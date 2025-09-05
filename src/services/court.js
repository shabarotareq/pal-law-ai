// court.js
import api from "./api";

const askAI = async ({ question, context = "" }) => {
  const res = await api.post("/ai/respond", { question, context });
  return res.data;
};

export default { askAI };
