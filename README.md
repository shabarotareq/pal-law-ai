# Pal-Law AI

**Pal-Law AI** هي منصة قانونية متكاملة تعتمد على الذكاء الاصطناعي لتقديم الاستشارات القانونية، تحليل القضايا، كتابة المرافعات، وإدارة المعلومات القانونية. المنصة توفر تجربة متقدمة للمستخدمين من المحامين، القضاة، والطلاب القانونيين، إضافةً إلى ميزة المحكمة الافتراضية التفاعلية ثلاثية الأبعاد.

---

# عدالة AI – منصة المحاكم الافتراضية

## وصف المنصة

منصة ذكية شاملة لإدارة القضايا القانونية والمحاكم الافتراضية. المنصة تستخدم:

- الذكاء الاصطناعي لتحليل القضايا، كتابة المرافعات، وإدارة البيانات القانونية.
- VR/AR لتجربة ثلاثية الأبعاد تفاعلية للمحكمة.
- WebRTC لتسجيل جلسات الصوت والفيديو.
- Roles policy للتحكم في الأدوار حسب الصلاحية.

## الميزات الرئيسية

### 1. إدارة القوانين والمستندات

- قاعدة بيانات متكاملة للقوانين الفلسطينية.
- القدرة على البحث المتقدم في القوانين والوثائق القانونية.
- تحليل تاريخي للقضايا وربطها بالقوانين المعمول بها.
- إنشاء مرافعات ووثائق قانونية تلقائيًا بناءً على معطيات القضايا.

### 2. الذكاء الاصطناعي القانوني

- تحليل القضايا واقتراح حلول قانونية دقيقة.
- توليد مسودات المرافعات والدفوع القانونية.
- تقديم استشارات قانونية ذكية باستخدام OpenAI API.
- روبوتات AI لمحاكاة المتهمين والشهود عند عدم وجود مستخدمين بشريين.

### 3. المحكمة الافتراضية ثلاثية الأبعاد

- استخدام **Three.js** و **WebXR** لتجربة VR/AR كاملة.
- قاعة محكمة ثلاثية الأبعاد تحاكي المحاكم النظامية.
- الشخصيات: القضاة، المحامين، المدعين العامين، المتهمين، الشهود، والجمهور.
- إمكانية تغيير الدور ديناميكيًا لكل مستخدم: قاضٍ، محامٍ، مدعي عام، متهم، شاهد.
- التحكم في تحركات الشخصيات باستخدام واجهة مشابهة لألعاب FPS مثل Counter-Strike.
- توليد شخصيات AI للمشاركين الغير بشريين لتفاعل ديناميكي في الجلسات.

### 4. بروتوكول جلسة المحكمة

- فتح الجلسة → إثبات الحضور → النداء على القضية → عرض لائحة الاتهام → استجواب → مرافعات → مداولة → إصدار الحكم.
- الالتزام بالقواعد والقيود لكل دور (Roles Policy):
  - الشهود يتكلمون عند الاستدعاء فقط.
  - المحامي يقدم المرافعة في الوقت المخصص.
  - القاضي يدير الجلسة ويصدر الأحكام.

### 5. تعدد اللاعبين والمزامنة

- إنشاء غرف خاصة لكل قضية عبر WebSockets وJWT للمصادقة.
- مشاركة المستخدمين من أجهزة مختلفة في نفس الجلسة.
- مزامنة تحركات الشخصيات والأدوار والتفاعلات.

### 6. تسجيل الجلسات

- WebRTC لتسجيل الصوت والفيديو لكل جلسة.
- حفظ نص المحادثات والنقاشات القانونية.
- إمكانية إعادة مشاهدة الجلسة لأغراض التدريب أو المراجعة القانونية.

### 7. واجهة المستخدم والتجربة

- واجهة حديثة ومتجاوبة مع تصميم احترافي.
- لوحة تحكم ديناميكية مع Sidebar، Header، وإحصائيات تفاعلية.
- تجربة المستخدم سلسة مع دعم الهواتف، الأجهزة اللوحية، وشاشات الكمبيوتر.

### 8. الأمن والتحكم

- تسجيل الدخول باستخدام JWT.
- إدارة الصلاحيات لتقييد الوصول للأدوار المختلفة.
- حماية البيانات القانونية والمراسلات الحساسة.

---

## التقنيات المستخدمة

- **Frontend:** React.js، @react-three/fiber، @react-three/drei، Three.js، WebXR.
- **Backend:** Python Flask، SQLAlchemy، PostgreSQL.
- **AI:** OpenAI API لتوليد النصوص القانونية والردود الذكية.
- **Realtime & VR:** WebSockets، WebRTC، VR/AR APIs.
- **UI/UX:** CSS3، TailwindCSS، تصميم متجاوب وحديث.

---

## الهيكلية العامة للمنصة

pal-law-ai-project/
├── frontend/
├── backend/
├── database/
├── docs/
└── README.md

---

## الاستخدام

1. إعداد بيئة Python للـ Backend وتثبيت المتطلبات.
2. إعداد بيئة Node.js للـ Frontend وتثبيت الحزم.
3. تشغيل الخادم Backend على localhost:5000.
4. تشغيل واجهة Frontend على localhost:3000.
5. الوصول إلى المحكمة الافتراضية من واجهة المستخدم.
6. تجربة إدارة القوانين، تحليل القضايا، والمشاركة في جلسات VR/AR.

---

## الهدف

تمكين المستخدمين من تجربة محكمة افتراضية ذكية، تحليل القضايا القانونية، واستخدام أدوات الذكاء الاصطناعي في تطبيق القانون الفلسطيني بشكل تفاعلي وآمن.

## المحكمة الافتراضية

- جلسات ثلاثية الأبعاد تفاعلية باستخدام Three.js وWebXR.
- أدوار متعددة: قضاة، محامون، مدعون عامون، متهمون، شهود، AI bots.
- بروتوكول الجلسة: فتح الجلسة → إثبات الحضور → النداء على القضية → عرض لائحة الاتهام → استجواب → مرافعات → مداولة → حكم.
- AI يولد شهادات ودفوع مختصرة للشخصيات غير البشرية.
- Multiplayer: JWT + rooms خاصة بالقضايا.

## تشغيل المنصة

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
py -m venv venv
source venv/bin/activate  # على ويندوز: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

# CourtSim — Project Skeleton

This is a minimal Next.js skeleton for the "محكمة افتراضية" project discussed.
It includes example API routes that read JSON cases from `data/cases/` and a simple HUD page.

## Quick start (local)

Requirements: Node.js 18+

```bash
# 1. install
npm install

# 2. run dev server (http://localhost:3000)
npm run dev
```

## Files of interest

- `src/pages/index.js` — Lobby / list of cases
- `src/pages/court/[caseId].js` — Court scene page
- `src/pages/api/cases/index.js` — API route: GET /api/cases
- `src/pages/api/cases/[id].js` — API route: GET /api/cases/:id
- `data/cases/CASE-2025-001.json` — sample case
- `public/assets/sample-evidence/` — put images/audio here

## Deploy to Vercel (quick)

1. Push repo to GitHub.
2. Create a new project on https://vercel.com and import the GitHub repository.
   Vercel auto-detects Next.js and will deploy your app. Or use the Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel
```

## Notes

- This skeleton uses static JSON files for data (in `data/cases/`). For production use, use a DB (Supabase/Postgres/Prisma).
- For realtime sessions, use a dedicated backend or services like Pusher / Supabase Realtime; Vercel serverless functions are not ideal for long-lived WebSockets.

# CourtSim

مشروع محكمة افتراضية (واجهة + خادم WebSocket).

## المجلدات

- `frontend/` → Next.js (واجهة المستخدم).
- `backend/` → Express + Socket.IO (الخادم).
- `docker-compose.yml` → لتشغيل الكل محليًا.

## تشغيل محلي

```bash
# في نافذتين
cd backend && npm install && npm start
cd frontend && npm install && npm run dev
```
