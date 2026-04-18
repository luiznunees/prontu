-- ============================================
-- rpc.sql — Executar no Supabase SQL Editor (APÓS 002_credits.sql)
-- ============================================

-- Consumir 1 crédito de forma atômica (evita race condition)
CREATE OR REPLACE FUNCTION consumir_credito(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  creditos_atual INTEGER;
BEGIN
  SELECT creditos INTO creditos_atual
  FROM users WHERE id = p_user_id FOR UPDATE;
  
  IF creditos_atual <= 0 THEN
    RETURN FALSE;
  END IF;
  
  UPDATE users SET creditos = creditos - 1 WHERE id = p_user_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Adicionar créditos
CREATE OR REPLACE FUNCTION adicionar_creditos(p_user_id UUID, p_quantidade INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users SET creditos = creditos + p_quantidade WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar total de trabalhos gerados pelo usuário
CREATE OR REPLACE FUNCTION incrementar_total_trabalhos(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users SET total_trabalhos = total_trabalhos + 1 WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar status do pagamento de forma segura via webhook
CREATE OR REPLACE FUNCTION atualizar_status_pagamento(p_pix_id TEXT, p_status TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE pagamentos SET status = p_status WHERE pix_id = p_pix_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
