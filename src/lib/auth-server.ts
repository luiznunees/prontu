import { createServerSupabaseClient } from './supabase';

export async function getCurrentUser() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) return null;
  return data;
}

export async function createUserIfNotExists(email: string, nome: string, id: string) {
  const supabase = createServerSupabaseClient();
  
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('users')
    .insert([{ 
      id, 
      email, 
      nome, 
      creditos: 1,
      trabalho_gratis_usado: false
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
