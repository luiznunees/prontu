-- ============================================
-- rpc.sql — CORRIGIDO
-- ============================================

-- Consumir 1 crédito de forma atômica
CREATE OR REPLACE FUNCTION consumir_credito(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_creditos INTEGER;
BEGIN
  SELECT creditos INTO v_creditos
  FROM users WHERE id = p_user_id FOR UPDATE;
  
  IF v_creditos <= 0 THEN
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