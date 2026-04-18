-- ============================================
-- rpc.sql — CORRIGIDO FINAL
-- ============================================

-- Consumir 1 crédito
CREATE OR REPLACE FUNCTION consumir_credito(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_creditos INTEGER;
  v_novo_creditos INTEGER;
BEGIN
  SELECT creditos INTO v_creditos
  FROM users WHERE id = p_user_id FOR UPDATE;
  
  IF v_creditos <= 0 THEN
    RETURN FALSE;
  END IF;
  
  v_novo_creditos := v_creditos - 1;
  UPDATE users SET creditos = v_novo_creditos WHERE id = p_user_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Adicionar créditos
CREATE OR REPLACE FUNCTION adicionar_creditos(p_user_id UUID, p_quantidade INTEGER)
RETURNS VOID AS $$
DECLARE
  v_creditos INTEGER;
BEGIN
  SELECT creditos INTO v_creditos FROM users WHERE id = p_user_id;
  UPDATE users SET creditos = v_creditos + p_quantidade WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Incrementar total de trabalhos
CREATE OR REPLACE FUNCTION incrementar_total_trabalhos(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users SET total_trabalhos = total_trabalhos + 1 WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atualizar status do pagamento
CREATE OR REPLACE FUNCTION atualizar_status_pagamento(p_pix_id TEXT, p_status TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE pagamentos SET status = p_status WHERE pix_id = p_pix_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;