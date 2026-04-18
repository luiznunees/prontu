-- ============================================
-- 005_trabalho_status.sql
-- Adicionar coluna status para trabalhos pendentes
-- Executar no Supabase SQL Editor
-- ============================================

ALTER TABLE trabalhos
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'concluido', 'erro')),
  ADD COLUMN IF NOT EXISTS erroMensagem TEXT,
  ADD COLUMN IF NOT EXISTS conteudo_gerado JSONB,
  ADD COLUMN IF NOT EXISTS tentativas INTEGER DEFAULT 0;

-- Atualizar trabalhos existentes para 'concluido'
UPDATE trabalhos SET status = 'concluido' WHERE status IS NULL;

-- Índice para trabalhos pendentes por usuário
CREATE INDEX IF NOT EXISTS idx_trabalhos_user_status ON trabalhos(user_id, status) WHERE status IN ('pendente', 'processando');