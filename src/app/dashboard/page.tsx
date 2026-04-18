import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { createServerSupabaseClient } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const supabase = createServerSupabaseClient();

  // Buscar perfil com créditos
  let { data: profile } = await supabase
    .from("users")
    .select("nome, creditos, telefone_coletado")
    .eq("id", user.id)
    .single();

  // Se não existir perfil, criar agora com 1 crédito grátis
  if (!profile && user.email) {
    await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      nome: user.user_metadata?.full_name || "Estudante",
      creditos: 1,
      telefone_coletado: false
    });
    // Recarregar perfil
    const { data: novoProfile } = await supabase
      .from("users")
      .select("nome, creditos, telefone_coletado")
      .eq("id", user.id)
      .single();
    if (novoProfile) profile = novoProfile;
  }

  // Buscar histórico de trabalhos
  const { data: trabalhos } = await supabase
    .from("trabalhos")
    .select("*")
    .eq("user_id", user.id)
    .order("criado_em", { ascending: false });

  const primeiroNome = profile?.nome?.split(" ")[0] || "Estudante";

  return (
    <DashboardClient
      profile={profile ?? { nome: "Estudante", creditos: 0, telefone_coletado: false }}
      trabalhos={trabalhos ?? []}
      primeiroNome={primeiroNome}
    />
  );
}
