import { createServerSupabaseClient } from './supabase';

export async function checkCanGenerate(userId: string): Promise<{
  allowed: boolean;
  creditos: number;
  reason?: string;
}> {
  const supabase = createServerSupabaseClient();
  const { data: user } = await supabase
    .from('users')
    .select('creditos')
    .eq('id', userId)
    .single();

  if (!user) return { allowed: false, creditos: 0, reason: 'user_not_found' };
  if (user.creditos <= 0) return { allowed: false, creditos: 0, reason: 'sem_creditos' };
  return { allowed: true, creditos: user.creditos };
}

export async function verificarCreditoEUsar(userId: string): Promise<{
  podeGerar: boolean;
  tipo: 'gratis' | 'pago' | 'sem_credito';
  creditosAtuais: number;
}> {
  const supabase = createServerSupabaseClient();
  
  const { data: user, error: errorUser } = await supabase
    .from('users')
    .select('creditos, trabalho_gratis_usado, ultimo_mes_gratis')
    .eq('id', userId)
    .single();
  
  if (errorUser || !user) {
    console.error('Erro ao buscar usuário:', errorUser);
    return { podeGerar: false, tipo: 'sem_credito', creditosAtuais: 0 };
  }
  
  const mesAtual = new Date().toISOString().slice(0, 7);
  let trabalhoGratisUsado = user.trabalho_gratis_usado;
  
  if (user.ultimo_mes_gratis !== mesAtual) {
    trabalhoGratisUsado = false;
    await supabase
      .from('users')
      .update({ trabalho_gratis_usado: false, ultimo_mes_gratis: mesAtual })
      .eq('id', userId);
  }
  
  if (user.creditos > 0) {
    const novosCreditos = user.creditos - 1;
    await supabase
      .from('users')
      .update({ creditos: novosCreditos })
      .eq('id', userId);
    return { podeGerar: true, tipo: 'pago', creditosAtuais: novosCreditos };
  }
  
  if (user.creditos <= 0 && trabalhoGratisUsado === false) {
    await supabase
      .from('users')
      .update({ trabalho_gratis_usado: true, ultimo_mes_gratis: mesAtual })
      .eq('id', userId);
    return { podeGerar: true, tipo: 'gratis', creditosAtuais: 0 };
  }
  
  return { podeGerar: false, tipo: 'sem_credito', creditosAtuais: 0 };
}

export async function consumirCredito(userId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.rpc('consumir_credito', { p_user_id: userId });
  if (error) {
    console.error('Erro ao consumir crédito:', error);
    return false;
  }
  return data === true;
}

export async function adicionarCreditos(userId: string, quantidade: number): Promise<void> {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.rpc('adicionar_creditos', {
    p_user_id: userId,
    p_quantidade: quantidade,
  });
  if (error) console.error('Erro ao adicionar créditos:', error);
}

export async function saveTrabalho(
  userId: string,
  dados: { titulo: string; disciplina: string; enunciado: string; pdf_url?: string; status?: string; erroMensagem?: string }
): Promise<string | undefined> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('trabalhos')
    .insert({ user_id: userId, pdf_url: '#', status: 'concluido', ...dados })
    .select('id')
    .single();

  if (error) {
    console.error('Erro ao salvar trabalho:', error);
    return undefined;
  }

  await supabase.rpc('incrementar_total_trabalhos', { p_user_id: userId });

  return data?.id;
}