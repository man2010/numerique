import { redirect } from "next/navigation";
import { createClient } from "../../src/lib/supabase/server";
import SosLogo from "../components/sos-logo";
import ThemeToggle from "../components/theme-toggle";

export default async function AdministrationPage() {
  const supabase = await createClient();
  if (!supabase) redirect("/connexion?configuration=supabase");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?role=admin");
  const { data: profile } = await supabase.from("profiles").select("display_name, role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect(profile?.role === "educator" ? "/educateur" : "/espace-jeune");
  return <main className="workspace-page"><header><SosLogo/><ThemeToggle /><form action="/auth/signout" method="post"><button className="landing-login">Se déconnecter</button></form></header><section><div className="section-eyebrow">ADMINISTRATION</div><h1>Bonjour{profile.display_name ? `, ${profile.display_name}` : ""}</h1><p>Bienvenue dans l’espace d’administration de la plateforme.</p><div className="workspace-card"><span>◈</span><h2>Les outils de pilotage arrivent ici.</h2><p>La gestion des parcours, des organisations et des comptes sera construite dans cette section.</p></div></section></main>;
}
