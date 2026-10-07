import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../src/lib/supabase/server";
import LearnerHub from "./learner-hub";
import SosLogo from "../components/sos-logo";
import ThemeToggle from "../components/theme-toggle";

export default async function LearnerWorkspacePage() {
  const supabase = await createClient();
  if (!supabase) redirect("/connexion?configuration=supabase");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const { data: profile } = await supabase.from("profiles").select("display_name, role, age_band").eq("id", user.id).maybeSingle();
  if (profile?.role === "admin") redirect("/administration");
  if (profile?.role === "educator") redirect("/educateur");

  const band = profile?.age_band ?? "9-11";
  const ages: Record<string, [number, number]> = { "6-8": [6, 8], "9-11": [9, 11], "12-15": [12, 15], "16-18": [16, 18] };
  const [ageMin, ageMax] = ages[band] ?? ages["9-11"];
  const { data: track } = await supabase.from("learning_tracks").select("id, title, description").eq("status", "published").lte("age_min", ageMin).gte("age_max", ageMax).order("sort_order").limit(1).maybeSingle();
  let modules: { id: string; title: string; summary: string; estimated_minutes: number; content: unknown }[] = [];
  let progress: { module_id: string; progress_percent: number; score: number | null; completed_at: string | null }[] = [];
  if (track) {
    const [moduleResult, progressResult] = await Promise.all([
      supabase.from("modules").select("id, title, summary, estimated_minutes, content").eq("track_id", track.id).eq("status", "published").order("sort_order").limit(12),
      supabase.from("module_progress").select("module_id, progress_percent, score, completed_at").eq("learner_id", user.id),
    ]);
    modules = moduleResult.data ?? [];
    progress = progressResult.data ?? [];
  }
  return <><header className="workspace-header"><SosLogo/><nav aria-label="Navigation de mon espace"><a href="#mon-parcours">Mon parcours</a><a href="#bons-reflexes">Mes bons réflexes</a></nav><ThemeToggle /><form action="/auth/signout" method="post"><button className="landing-login">Se déconnecter</button></form></header><LearnerHub name={profile?.display_name ?? "Explorateur·rice"} band={band} track={track} modules={modules} progress={progress} /></>;
}
