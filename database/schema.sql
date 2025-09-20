-- إنشاء جدول المستخدمين
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    avatar VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    settings TEXT DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    CONSTRAINT valid_role CHECK (role IN ('admin', 'moderator', 'user'))
);

-- إنشاء جدول سجل المحادثات مع ربطه بالمستخدمين
CREATE TABLE chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_user BOOLEAN NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء جدول الوثائق القانونية
CREATE TABLE law_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    keywords TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهارس للبحث السريع
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_timestamp ON chat_history(timestamp);
CREATE INDEX idx_law_documents_category ON law_documents(category);
CREATE INDEX idx_law_documents_keywords ON law_documents USING GIN(keywords gin_trgm_ops);

-- إضافة مستخدم مدير افتراضي (كلمة المرور: admin123)
INSERT INTO users (name, email, password_hash, role, active) VALUES (
    'المدير العام',
    'admin@example.com',
    '$2b$12$L7jvUuUYVW7c3B6q8n1Qz.Xn7p8n1Qz.Xn7p8n1Qz.Xn7p8n1Qz.Xn7p8',
    'admin',
    true
);
