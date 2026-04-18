-- ============================================
-- 002_credits.sql — Executar no Supabase SQL Editor
-- ============================================

-- Adicionar colunas na tabela users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS creditos INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS telefone TEXT,
  ADD COLUMN IF NOT EXISTS serie TEXT,
  ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_trabalhos INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS telefone_coletado BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS trabalho_gratis_usado BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS ultimo_mes_gratis TEXT,
  ADD COLUMN IF NOT EXISTS plano_assinatura TEXT,
  ADD COLUMN IF NOT EXISTS assinatura_ativa BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS data_fim_assinatura TIMESTAMPTZ;

-- Remover colunas do modelo antigo de assinatura
ALTER TABLE users
  DROP COLUMN IF EXISTS plano,
  DROP COLUMN IF EXISTS trabalhos_gerados_mes,
  DROP COLUMN IF EXISTS mes_atual,
  DROP COLUMN IF EXISTS abacate_customer_id;

-- Atualizar tabela pagamentos para modelo de créditos
ALTER TABLE pagamentos
  ADD COLUMN IF NOT EXISTS creditos_comprados INTEGER,
  ADD COLUMN IF NOT EXISTS pacote TEXT;

-- Tabela de notificações (para controle de disparos futuros)
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  canal TEXT NOT NULL,
  enviada_em TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'enviado'
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON notificacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_notif_tipo ON notificacoes(tipo, enviada_em);
