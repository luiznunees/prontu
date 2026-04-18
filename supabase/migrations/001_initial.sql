CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  plano TEXT DEFAULT 'gratis' CHECK (plano IN ('gratis', 'basico', 'plus')),
  trabalhos_gerados_mes INTEGER DEFAULT 0,
  mes_atual TEXT DEFAULT to_char(NOW(), 'YYYY-MM'),
  abacate_customer_id TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE trabalhos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  disciplina TEXT,
  enunciado TEXT,
  pdf_url TEXT,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pix_id TEXT NOT NULL,
  valor INTEGER NOT NULL,
  plano TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trabalhos_user ON trabalhos(user_id);
CREATE INDEX idx_pagamentos_pix ON pagamentos(pix_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trabalhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users read own trabalhos" ON trabalhos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own trabalhos" ON trabalhos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own pagamentos" ON pagamentos FOR SELECT USING (auth.uid() = user_id);
