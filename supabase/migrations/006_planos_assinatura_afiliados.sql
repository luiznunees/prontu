-- ============================================
-- 006_planos_assinatura_afiliados.sql
-- Planos de assinatura e programa de afiliados
-- Executar no Supabase SQL Editor
-- ============================================

-- Tabela de afiliados
CREATE TABLE IF NOT EXISTS afiliados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  codigo TEXT UNIQUE NOT NULL,
  creditos_ganhos INTEGER DEFAULT 0,
  indicaacoes INTEGER DEFAULT 0,
  comissao_ganha INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de comissões de afiliados
CREATE TABLE IF NOT EXISTS comissoes_afiliados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  afiliado_id UUID REFERENCES afiliados(id) ON DELETE CASCADE,
  indicador_id UUID REFERENCES users(id),
  trabalho_id UUID REFERENCES trabalhos(id),
  valor INTEGER NOT NULL,
  status TEXT DEFAULT 'pendente',
  pago_em TIMESTAMPTZ,
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de favoritos/templates
CREATE TABLE IF NOT EXISTS favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  item_id TEXT NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tipo, item_id)
);

-- Tabela de rascunhos
CREATE TABLE IF NOT EXISTS rascunhos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enunciado TEXT,
  disciplina TEXT,
  escola TEXT,
  serie TEXT,
  nome_aluno TEXT,
  observacao TEXT,
  lingua TEXT DEFAULT 'pt',
  status TEXT DEFAULT 'rascunho',
  trabalhos_conteudo JSONB,
  criado_em TIMESTAMPTZ DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para favoritos
CREATE INDEX IF NOT EXISTS idx_favoritos_user ON favoritos(user_id, tipo);

-- Índice para rascunhos
CREATE INDEX IF NOT EXISTS idx_rascunhos_user ON rascunhos(user_id, status);

-- Índice para comissões
CREATE INDEX IF NOT EXISTS idx_comissoes_afiliado ON comissoes_afiliados(afiliado_id, status);

-- policies RLS
ALTER TABLE afiliados ENABLE ROW LEVEL SECURITY;
ALTER TABLE comissoes_afiliados ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rascunhos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own afiliados" ON afiliados FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own comissoes" ON comissoes_afiliados FOR ALL USING (auth.uid() = indicador_id);
CREATE POLICY "Users own favoritos" ON favoritos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own rascunhos" ON rascunhos FOR ALL USING (auth.uid() = user_id);

-- Criar índice para código de afiliado único
CREATE UNIQUE INDEX IF NOT EXISTS idx_afiliados_codigo ON afiliados(codigo);