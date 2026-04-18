-- ============================================
-- 004_user_tracking.sql — Executar no Supabase SQL Editor
-- Adicionar campos para tracking de uso gratuito
-- ============================================

-- Campo para trackear se o usuário já usou seu trabalho gratuito
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS trabalho_gratis_usado BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ultimo_mes_gratis TEXT;

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_users_trabalho_gratis ON users(id) WHERE trabalho_gratis_usado = FALSE;

-- ============================================
-- Função UNIFICADA: verificar E consumir crédito em uma transação
-- Retorna: { pode_gerar: boolean, tipo_credito: 'gratis'|'pago'|'sem_credito', creditos: integer }
-- ============================================
CREATE OR REPLACE FUNCTION verificar_e_consumir_credito(p_user_id UUID)
RETURNS TABLE(pode_gerar BOOLEAN, tipo_credito TEXT, creditos INTEGER) AS $$
DECLARE
  v_creditos INTEGER;
  v_gratis_usado BOOLEAN;
  v_mes_atual TEXT;
BEGIN
  -- Pegar dados atuais com lock
  SELECT creditos, trabalho_gratis_usado INTO v_creditos, v_gratis_usado
  FROM users WHERE id = p_user_id FOR UPDATE;
  
  v_mes_atual := to_char(NOW(), 'YYYY-MM');
  
  -- Caso 1: Tem créditos pagos
  IF v_creditos > 0 THEN
    UPDATE users SET creditos = creditos - 1 WHERE id = p_user_id;
    RETURN QUERY SELECT TRUE, 'pago', v_creditos - 1;
  END IF;
  
  -- Caso 2: Sem créditos pagos, mas não usou gratuito
  IF v_creditos <= 0 AND v_gratis_usado = FALSE THEN
    UPDATE users SET trabalho_gratis_usado = TRUE, ultimo_mes_gratis = v_mes_atual WHERE id = p_user_id;
    RETURN QUERY SELECT TRUE, 'gratis', 0;
  END IF;
  
  -- Caso 3: Sem créditos disponíveis
  RETURN QUERY SELECT FALSE, 'sem_credito', 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Função ATÔMICA para processar pagamento PIX
-- Faz tudo em uma transação: idempotência + adicionar créditos + marcar pago
-- Retorna: { sucesso: boolean, creditos_adicionados: integer }
-- ============================================
CREATE OR REPLACE FUNCTION processar_pagamento_pix(p_pix_id TEXT, p_user_id UUID, p_creditos INTEGER)
RETURNS TABLE(sucesso BOOLEAN, creditos_adicionados INTEGER) AS $$
DECLARE
  v_pagamento RECORD;
  v_creditos_adicionar INTEGER;
BEGIN
  -- Verificar se pagamento já foi processado (idempotência)
  SELECT id, status INTO v_pagamento
  FROM pagamentos
  WHERE pix_id = p_pix_id
  FOR UPDATE;
  
  -- Se já foi pago, retornar sucesso sem fazer nada
  IF v_pagamento.status = 'PAID' THEN
    RETURN QUERY SELECT FALSE, 0;
  END IF;
  
  -- Determinar quantos créditos adicionar
  v_creditos_adicionar := COALESCE(
    (SELECT p.creditos_comprados FROM pagamentos p WHERE p.pix_id = p_pix_id),
    p_creditos,
    5
  );
  
  -- Adicionar créditos ao usuário
  UPDATE users SET creditos = creditos + v_creditos_adicionar WHERE id = p_user_id;
  
  -- Marcar pagamento como pago
  UPDATE pagamentos SET status = 'PAID' WHERE pix_id = p_pix_id;
  
  RETURN QUERY SELECT TRUE, v_creditos_adicionar;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;