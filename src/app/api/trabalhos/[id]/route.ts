import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: trabalho, error } = await supabase
      .from("trabalhos")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !trabalho) {
      return NextResponse.json({ error: "Trabalho não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ trabalho });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}