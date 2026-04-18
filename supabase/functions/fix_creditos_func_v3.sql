-- ============================================
-- Função FINAL: verificar E consumir crédito
-- ============================================
DROP FUNCTION IF EXISTS verificar_e_consumir_credito(UUID);

CREATE FUNCTION verificar_e_consumir_credito(p_user_id UUID)
RETURNS TABLE(pode_gerar BOOLEAN, tipo_credito TEXT, creditos INTEGER) AS $$
DECLARE
  v_creditos INTEGER;
  v_gratis_usado BOOLEAN;
  v_mes_atual TEXT;
BEGIN
  SELECT creditos, trabalho_gratis_usado 
  INTO v_creditos, v_gratis_usado
  FROM users 
  WHERE id = p_user_id 
  FOR UPDATE;
  
  v_mes_atual := to_char(NOW(), 'YYYY-MM');
  
  IF v_creditos > 0 THEN
    UPDATE users SET creditos = creditos - 1 WHERE id = p_user_id;
    RETURN QUERY SELECT TRUE, 'pago', v_creditos - 1;
  END IF;
  
  IF v_creditos <= 0 AND v_gratis_usado = FALSE THEN
    UPDATE users SET trabalho_gratis_usado = TRUE, ultimo_mes_gratis = v_mes_atual WHERE id = p_user_id;
    RETURN QUERY SELECT TRUE, 'gratis', 0;
  END IF;
  
  RETURN QUERY SELECT FALSE, 'sem_credito', 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;