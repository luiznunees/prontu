-- RPC para dar crédito ao indicador
CREATE OR REPLACE FUNCTION dar_credito_indicador(p_indicador_id TEXT)
RETURNS VOID AS $$
  UPDATE users 
  SET creditos = creditos + 1 
  WHERE indicador_id = p_indicador_id;
$$ LANGUAGE SQL;

-- Criar coluna indicador_id se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS indicador_id TEXT;

-- Índice para buscar por indicador
CREATE INDEX IF NOT EXISTS idx_users_indicador ON users(indicador_id);