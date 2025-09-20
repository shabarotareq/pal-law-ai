class ChatBotService {
  constructor() {
    this.knowledgeService = new LegalKnowledgeService();
  }

  async handleLegalQuestion(question, conversationHistory = []) {
    try {
      // البحث في المعرفة القانونية
      const knowledgeResults = await this.knowledgeService.searchLegalKnowledge(
        question
      );

      // توليد الإجابة
      const response = await this.knowledgeService.answerLegalQuestion(
        question,
        knowledgeResults
      );

      // تسجيل التفاعل
      await this.logInteraction(question, response, knowledgeResults);

      return response;
    } catch (error) {
      console.error("Error handling legal question:", error);
      return {
        answer: "عذراً، حدث خطأ في معالجة سؤالك. يرجى المحاولة مرة أخرى.",
        sources: [],
        confidence: 0,
      };
    }
  }

  async logInteraction(question, response, sources) {
    // تسجيل التفاعل للتحليل والتحسين
    const interaction = {
      timestamp: new Date(),
      question,
      response: response.answer,
      sources: sources.map((s) => s.metadata.originalName),
      confidence: response.confidence,
      userFeedback: null,
    };

    await fetch("/api/interactions/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(interaction),
    });
  }
}
