-- ============================================
-- 003_rls_pagamento.sql — Executar no Supabase SQL Editor
-- ============================================

-- Remover possíveis duplicatas se já existirem
DROP POLICY IF EXISTS "Users insert own pagamentos" ON pagamentos;
DROP POLICY IF EXISTS "Users update own pagamentos" ON pagamentos;

-- Permite que o usuário insira o pagamento no momento da Geração do PIX
CREATE POLICY "Users insert own pagamentos" ON pagamentos 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Permite que o usuário atualize o próprio pagamento (Ex: marcando como PAGO via checagem local)
CREATE POLICY "Users update own pagamentos" ON pagamentos 
  FOR UPDATE USING (auth.uid() = user_id);

-- Remover restrição da coluna legado 'plano' para o novo modelo de pacotes avulsos funcionar
ALTER TABLE pagamentos ALTER COLUMN plano DROP NOT NULL;
