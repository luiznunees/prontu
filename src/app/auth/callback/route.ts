import { NextResponse } from "next/server";
import { createUserIfNotExists } from "@/lib/auth-server";
import type { CookieOptions } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient(origin);
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("Erro ao trocar código por sessão:", error.message);
        return NextResponse.redirect(`${origin}/auth/auth-error?error=session_exchange`);
      }

      if (data.user) {
        // Registrar usuário no nosso banco se não existir
        try {
          await createUserIfNotExists(
            data.user.email!,
            data.user.user_metadata.full_name || "Estudante",
            data.user.id
          );

          // Verificar se é conta nova (criada nos últimos 60s)
          const isNewUser = new Date(data.user.created_at).getTime() > Date.now() - 60000;
          if (isNewUser && data.user.email) {
             const { enviarEmail, registrarNotificacao } = await import("@/lib/notificacoes");
             const { emails } = await import("@/lib/mensagens");
             const tmpl = emails.boas_vindas(data.user.user_metadata.full_name || "Estudante");
             const sent = await enviarEmail({ 
                para: data.user.email, 
                assunto: tmpl.assunto, 
                html: tmpl.html 
             });
             if (sent) await registrarNotificacao(data.user.id, "boas_vindas", "email");
          }

          // Sempre atualizar ultimo_login
          await supabase
            .from('users')
            .update({ ultimo_login: new Date().toISOString() })
            .eq('id', data.user.id);

        } catch (dbError: any) {
          console.error("Erro ao registrar usuário ou enviar e-mail:", dbError.message);
          return NextResponse.redirect(`${origin}/auth/auth-error?error=db_registration`);
        }
        
        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (err: any) {
      console.error("Erro inesperado no callback de auth:", err.message);
      return NextResponse.redirect(`${origin}/auth/auth-error?error=unexpected`);
    }
  }

  // Se der erro ou não houver código, volta pra home
  return NextResponse.redirect(`${origin}/`);
}

// Helper para criar o cliente com a URL correta (garantindo origin consistente)
function createClient(origin: string) {
  const { createServerClient } = require('@supabase/ssr');
  const { cookies } = require('next/headers');
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set({ name, value, ...options }); } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set({ name, value: '', ...options }); } catch (error) {}
        },
      },
    }
  );
}
