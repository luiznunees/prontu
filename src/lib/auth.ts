import { createClientComponentClient } from './supabase-client';

export async function signInWithGoogle() {
  const supabase = createClientComponentClient();
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
      skipBrowserRedirect: true,
    },
  });
  
  if (error) throw error;
  if (data?.url) window.location.href = data.url;
}

export async function signOut() {
  const supabase = createClientComponentClient();
  await supabase.auth.signOut();
  window.location.href = '/';
}
