// src/ai/AICharacter.js
import { OpenAI } from "openai";

class AICharacter {
  constructor() {
    const apiKey =
      process.env.REACT_APP_OPENAI_API_KEY ||
      localStorage.getItem("openai_api_key");

    if (!apiKey) {
      console.warn("OpenAI API key is missing. AI features will be disabled.");
      this.openai = null;
      this.isAvailable = false;
      return;
    }

    try {
      this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      this.isAvailable = true;
    } catch (error) {
      console.error("Failed to initialize OpenAI:", error);
      this.openai = null;
      this.isAvailable = false;
    }
  }

  async generateResponse(prompt) {
    if (!this.isAvailable || !this.openai)
      return "خدمة الذكاء الاصطناعي غير متاحة حالياً.";

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI API Error:", error);
      return "حدث خطأ في خدمة الذكاء الاصطناعي.";
    }
  }

  checkAvailability() {
    return this.isAvailable;
  }

  setApiKey(apiKey) {
    try {
      this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
      this.isAvailable = true;
      localStorage.setItem("openai_api_key", apiKey);
      return true;
    } catch {
      this.isAvailable = false;
      return false;
    }
  }
}

let aiInstance = null;
export const getAIInstance = () => {
  if (!aiInstance) aiInstance = new AICharacter();
  return aiInstance;
};
export default AICharacter;
