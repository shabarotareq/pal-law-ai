const Chat = require('../models/Chat');
const openai = require('../utils/openaiClient');


exports.chat = async (req, res) => {
const { message, chatId } = req.body;
const user = req.user; // from authMiddleware


try {
// prepare messages history (optional: fetch existing chat)
let chatDoc;
let history = [];
if (chatId) {
chatDoc = await Chat.findById(chatId);
if (chatDoc) history = chatDoc.messages.map(m => ({ role: m.role, content: m.content }));
}


history.push({ role: 'user', content: message });


// system prompt for legal assistant — make it conservative and include disclaimers
const systemPrompt = `أنت مساعد قانوني ذكي. أجب على أسئلة المستخدمين بطريقة واضحة ومبسطة. لا تقدّم نصائح تجرّم المستخدم أو تدفعه لخرق القانون. ضع تحذيراً أن المعلومات لا تغني عن الاستشارة القانونية الرسمية إذا لزم الأمر.`;


// Call OpenAI Chat Completions (example uses chat completions API)
const response = await openai.chat.completions.create({
model: process.env.AI_MODEL || 'gpt-4o-mini',
messages: [
{ role: 'system', content: systemPrompt },
...history
],
max_tokens: 800
});


const reply = response.choices[0].message.content;


// save/update chat
if (!chatDoc) {
chatDoc = await Chat.create({ user: user._id, messages: [
};