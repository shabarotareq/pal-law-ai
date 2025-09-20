import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { promises as fs } from 'fs';
import path from 'path';
import { LegalKnowledgeService } from './LegalKnowledgeService';

class DocumentProcessor {
  constructor() {
    this.knowledgeService = new LegalKnowledgeService();
    this.initPDFJS();
  }

  initPDFJS() {
    pdfjs.GlobalWorkerOptions.workerSrc = 
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  async processUploadedDocument(file, category, metadata = {}) {
    try {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      let content;

      switch (fileExtension) {
        case '.pdf':
          content = await this.extractTextFromPDF(file.buffer);
          break;
        case '.docx':
          content = await this.extractTextFromDOCX(file.buffer);
          break;
        case '.doc':
          content = await this.extractTextFromDOC(file.buffer);
          break;
        default:
          throw new Error('صيغة الملف غير مدعومة');
      }

      // معالجة المحتوى واستخراج المعلومات
      const processedData = await this.processLegalContent(content, {
        ...metadata,
        originalName: file.originalname,
        category,
        uploadDate: new Date()
      });

      // حفظ في قاعدة المعرفة
      await this.knowledgeService.addLegalDocument(processedData);

      return processedData;
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  async extractTextFromPDF(buffer) {
    try {
      const pdf = await pdfjs.getDocument({ data: buffer }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }

      return text;
    } catch (error) {
      throw new Error(`فشل في استخراج النص من PDF: ${error.message}`);
    }
  }

  async extractTextFromDOCX(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      throw new Error(`فشل في استخراج النص من DOCX: ${error.message}`);
    }
  }

  async extractTextFromDOC(buffer) {
    // يمكن استخدام مكتبات إضافية لملفات DOC القديمة
    throw new Error('ملفات DOC القديمة تتطلب أدوات إضافية');
  }

  async processLegalContent(text, metadata) {
    // استخراج المعلومات القانونية المهمة
    const sections = this.extractLegalSections(text);
    const keywords = this.extractKeywords(text);
    const entities = this.extractLegalEntities(text);

    return {
      content: text,
      sections,
      keywords,
      entities,
      metadata: {
        ...metadata,
        wordCount: text.split(/\s+/).length,
        processedDate: new Date()
      },
      embedding: await this.generateEmbedding(text)
    };
  }

  extractLegalSections(text) {
    // استخراج المواد والفقرات القانونية
    const sectionRegex = /(المادة\s+\d+[:\.]?|Article\s+\d+[:\.]?)/gi;
    const sections = [];
    let match;

    while ((match = sectionRegex.exec(text)) !== null) {
      const sectionStart = match.index;
      const sectionTitle = match[0];
      
      // البحث عن نهاية المادة
      const nextSection = text.indexOf('المادة', sectionStart + 1);
      const sectionEnd = nextSection !== -1 ? nextSection : text.length;
      
      const content = text.substring(sectionStart, sectionEnd).trim();
      sections.push({
        title: sectionTitle,
        content: content,
        number: this.extractSectionNumber(sectionTitle)
      });
    }

    return sections;
  }

  extractSectionNumber(sectionTitle) {
    const numberMatch = sectionTitle.match(/\d+/);
    return numberMatch ? parseInt(numberMatch[0]) : null;
  }

  extractKeywords(text) {
    // قائمة الكلمات المفتاحية القانونية الشائعة
    const legalKeywords = [
      'عقوبة', 'جنحة', 'جناية', 'تعويض', 'حكم', 'قضاء', 'محكمة',
      'دعوى', 'مدعي', 'مدعى عليه', 'شهادة', 'إثبات', 'بينة',
      'عقد', 'التزام', 'مسؤولية', 'تعاقد', 'فسخ', 'إنهاء'
    ];

    return legalKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  extractLegalEntities(text) {
    // استخراج الكيانات القانونية (أسماء قوانين، محاكم، etc)
    const entities = {
      laws: this.extractLawReferences(text),
      courts: this.extractCourtReferences(text),
      dates: this.extractDates(text)
    };

    return entities;
  }

  extractLawReferences(text) {
    const lawRegex = /(نظام|قانون|مرسوم)\s+([^،\.\n]+)/gi;
    return this.extractMatches(text, lawRegex);
  }

  extractCourtReferences(text) {
    const courtRegex = /(محكمة|دائرة|استئناف|تمييز)\s+([^،\.\n]+)/gi;
    return this.extractMatches(text, courtRegex);
  }

  extractDates(text) {
    const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4})|(\d{4}-\d{1,2}-\d{1,2})/g;
    return this.extractMatches(text, dateRegex);
  }

  extractMatches(text, regex) {
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[0]);
    }
    return matches;
  }

  async generateEmbedding(text) {
    // استخدام خدمة التضمين (مثل Sentence Transformers)
    return await this.knowledgeService.generateEmbedding(text);
  }
}

export default DocumentProcessor;