import { redirect } from "next/navigation";
import { createClient } from "../../src/lib/supabase/server";
import LearnerHub from "./learner-hub";

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
  const [{ data: publishedTracks }, { data: progressData }, { data: badgeData }, { data: earnedBadgeData }] = await Promise.all([
    supabase.from("learning_tracks").select("id, title, description, age_min, age_max, sort_order").eq("status", "published").order("sort_order"),
    supabase.from("module_progress").select("module_id, progress_percent, score, completed_at").eq("learner_id", user.id),
    supabase.from("badges").select("id, code, title, description, icon").order("title"),
    supabase.from("learner_badges").select("badge_id, earned_at").eq("learner_id", user.id),
  ]);
  const track = publishedTracks?.find((item) => item.age_min <= ageMin && item.age_max >= ageMax) ?? null;
  let modules: { id: string; title: string; summary: string; estimated_minutes: number; content: unknown }[] = [];
  let progress: { module_id: string; progress_percent: number; score: number | null; completed_at: string | null }[] = [];
  if (track) {
    const { data: moduleData } = await supabase.from("modules").select("id, title, summary, estimated_minutes, content").eq("track_id", track.id).eq("status", "published").order("sort_order").limit(100);
    modules = moduleData ?? [];
  }
  progress = progressData ?? [];
  return <LearnerHub name={profile?.display_name ?? "Explorateur·rice"} band={band} track={track} modules={modules} progress={progress} badges={badgeData ?? []} earnedBadges={earnedBadgeData ?? []} />;
}
