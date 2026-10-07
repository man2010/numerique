import { redirect } from "next/navigation";
import { createClient } from "../../src/lib/supabase/server";
import SosLogo from "../components/sos-logo";
import ThemeToggle from "../components/theme-toggle";

type Learner = { id: string; display_name: string; age_band: string | null };
type ModuleProgress = { learner_id: string; module_id: string; progress_percent: number; score: number | null; completed_at: string | null; updated_at: string };
type LearningModule = { id: string; track_id: string; title: string; summary: string; estimated_minutes: number };
type Track = { id: string; title: string; description: string; age_min: number; age_max: number };

const ageNames: Record<string, string> = { "6-8": "6–8 ans", "9-11": "9–11 ans", "12-15": "12–15 ans", "16-18": "16–18 ans" };
const ageIcons: Record<string, string> = { "6-8": "🌱", "9-11": "🧭", "12-15": "🔎", "16-18": "🚀" };

export default async function WorkspacePage() {
  const supabase = await createClient();
  if (!supabase) redirect("/connexion?configuration=supabase");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");
  const { data: profile } = await supabase.from("profiles").select("display_name, role").eq("id", user.id).maybeSingle();
  const role = profile?.role ?? "learner";
  if (role === "admin") redirect("/administration");
  if (role === "learner") redirect("/espace-jeune");

  const [{ data: learnerData }, { data: trackData }, { data: moduleData }] = await Promise.all([
    supabase.from("profiles").select("id, display_name, age_band").eq("educator_id", user.id).eq("role", "learner").order("display_name"),
    supabase.from("learning_tracks").select("id, title, description, age_min, age_max").eq("status", "published").order("sort_order"),
    supabase.from("modules").select("id, track_id, title, summary, estimated_minutes").eq("status", "published").order("sort_order"),
  ]);
  const learners = (learnerData ?? []) as Learner[];
  const tracks = (trackData ?? []) as Track[];
  const modules = (moduleData ?? []) as LearningModule[];
  let progress: ModuleProgress[] = [];
  if (learners.length) {
    const { data } = await supabase.from("module_progress").select("learner_id, module_id, progress_percent, score, completed_at, updated_at").in("learner_id", learners.map((learner) => learner.id)).order("updated_at", { ascending: false });
    progress = (data ?? []) as ModuleProgress[];
  }
  const completed = progress.filter((item) => item.completed_at).length;
  const active = progress.filter((item) => item.progress_percent > 0 && !item.completed_at).length;
  const recentlyActive = progress[0];
  const modulesByTrack = new Map<string, LearningModule[]>();
  modules.forEach((module) => modulesByTrack.set(module.track_id, [...(modulesByTrack.get(module.track_id) ?? []), module]));

  return <main className="workspace-page educator-page">
    <header className="workspace-header"><SosLogo/><nav aria-label="Navigation éducateur"><a href="#overview">Vue d’ensemble</a><a href="#jeunes">Jeunes suivis</a><a href="#ressources">Ressources</a></nav><ThemeToggle/><form action="/auth/signout" method="post"><button>Se déconnecter</button></form></header>
    <div className="educator-layout" id="overview">
      <section className="educator-welcome">
        <div className="educator-welcome-copy"><span className="educator-kicker"><i/> ESPACE ÉDUCATEUR · SOS VILLAGES D’ENFANTS</span><h1>Bonjour{profile?.display_name ? `, ${profile.display_name.split(" ")[0]}` : ""} <span>👋</span></h1><p>Accompagne les jeunes dans leurs découvertes numériques, repère leurs besoins et prépare des séances qui leur parlent.</p><div className="educator-welcome-actions"><a href="#jeunes">Voir les jeunes <span>↓</span></a><a className="educator-secondary-link" href="#ressources">Préparer une séance <span>↗</span></a></div></div>
        <div className="educator-welcome-art" aria-hidden="true"><span className="educator-art-orbit orbit-one"/><span className="educator-art-orbit orbit-two"/><span className="educator-art-star">✦</span><div className="educator-art-card"><span>✳</span><b>Grandir<br/>en confiance</b><small>Apprendre · échanger · protéger</small></div><span className="educator-art-emoji">🌻</span></div>
      </section>

      <section className="educator-metrics" aria-label="Indicateurs de suivi">
        <article><span className="educator-metric-icon metric-cyan">♧</span><div><small>Jeunes rattachés</small><b>{learners.length}</b><p>{learners.length ? "dans ton espace" : "à rattacher à ton compte"}</p></div><span className="metric-corner">↗</span></article>
        <article><span className="educator-metric-icon metric-yellow">✦</span><div><small>Activités terminées</small><b>{completed}</b><p>sur les parcours suivis</p></div><span className="metric-corner">✓</span></article>
        <article><span className="educator-metric-icon metric-lilac">◷</span><div><small>En cours</small><b>{active}</b><p>activités commencées</p></div><span className="metric-corner">↗</span></article>
        <article><span className="educator-metric-icon metric-peach">▤</span><div><small>Parcours disponibles</small><b>{tracks.length}</b><p>adaptés aux âges</p></div><span className="metric-corner">↗</span></article>
      </section>

      <div className="educator-main-grid">
        <section className="educator-panel learners-panel" id="jeunes">
          <div className="educator-section-heading"><div><span className="educator-kicker">TON GROUPE</span><h2>Les jeunes que tu accompagnes</h2><p>Un aperçu de leur activité et de leurs progrès.</p></div><span className="educator-count-pill">{learners.length} jeune{learners.length === 1 ? "" : "s"}</span></div>
          {learners.length ? <div className="educator-learner-list">{learners.map((learner, index) => {
            const items = progress.filter((item) => item.learner_id === learner.id);
            const done = items.filter((item) => item.completed_at).length;
            const started = items.filter((item) => item.progress_percent > 0 && !item.completed_at).length;
            const scoreItems = items.filter((item) => item.score !== null);
            const averageScore = scoreItems.length ? Math.round(scoreItems.reduce((sum, item) => sum + (item.score ?? 0), 0) / scoreItems.length) : null;
            return <article className="educator-learner-row" key={learner.id}><span className={`learner-avatar educator-avatar avatar-${index % 4}`}>{learner.display_name?.trim().charAt(0)?.toUpperCase() || "J"}</span><div className="educator-learner-name"><b>{learner.display_name}</b><small>{learner.age_band ? `${ageIcons[learner.age_band] ?? "👤"} ${ageNames[learner.age_band] ?? learner.age_band}` : "Âge non renseigné"}</small></div><div className="learner-activity"><b>{done + started}</b><small>activité{done + started === 1 ? "" : "s"} suivie{done + started === 1 ? "" : "s"}</small></div><div className="learner-score"><b>{averageScore === null ? "—" : `${averageScore}%`}</b><small>{averageScore === null ? "pas de quiz noté" : "score moyen"}</small></div><span className="learner-row-arrow" aria-hidden="true">↗</span></article>;
          })}</div> : <div className="educator-empty-state"><div className="empty-illustration" aria-hidden="true"><span>👩🏾‍🏫</span><i>✦</i></div><div><b>Ton groupe se construit ici</b><p>Aucun jeune n’est encore rattaché à ton compte. Dès que l’équipe associera les profils, tu retrouveras ici leur activité et leurs progrès.</p></div></div>}
          <div className="educator-privacy-note"><span>♧</span> Les données affichées sont limitées aux jeunes rattachés à ton compte.</div>
        </section>

        <aside className="educator-panel activity-panel"><div className="educator-section-heading compact"><div><span className="educator-kicker">À SUIVRE</span><h2>Activité récente</h2></div><span className="activity-live"><i/> À JOUR</span></div>{recentlyActive ? <div className="recent-activity-card"><span className="recent-activity-icon">⚡</span><div><small>Dernière progression enregistrée</small><b>{learners.find((learner) => learner.id === recentlyActive.learner_id)?.display_name ?? "Un jeune"}</b><p>{modules.find((module) => module.id === recentlyActive.module_id)?.title ?? "Activité de parcours"} · {recentlyActive.progress_percent}%</p><time>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(recentlyActive.updated_at))}</time></div></div> : <div className="activity-empty"><span>☀</span><b>La prochaine étape commence ici</b><p>Quand un jeune commencera une activité, son avancée apparaîtra dans ce fil.</p></div>}<a className="activity-tip" href="#ressources"><span>💡</span><div><b>Le petit plus</b><p>Une discussion de 10 minutes après un quiz aide à ancrer les bons réflexes.</p></div><span>↗</span></a></aside>
      </div>

      <section className="educator-resources" id="ressources"><div className="educator-section-heading resources-heading"><div><span className="educator-kicker">PRÊT·E POUR LA PROCHAINE SÉANCE ?</span><h2>Des ressources pour ouvrir la discussion</h2><p>Des parcours et activités publiés, organisés par tranche d’âge pour t’aider à préparer ton animation.</p></div><span className="resource-heading-mark">✳</span></div>
        {tracks.length ? <div className="educator-track-grid">{tracks.map((track, index) => {
          const trackModules = modulesByTrack.get(track.id) ?? [];
          return <article className={`educator-track-card track-tone-${index % 4}`} key={track.id}><div className="track-card-top"><span>{ageIcons[track.age_min <= 8 ? "6-8" : track.age_min <= 11 ? "9-11" : track.age_min <= 15 ? "12-15" : "16-18"] ?? "✦"}</span><small>{track.age_min}–{track.age_max} ANS</small></div><h3>{track.title}</h3><p>{track.description}</p><div className="track-card-bottom"><span>{trackModules.length} activité{trackModules.length === 1 ? "" : "s"} · {trackModules.reduce((sum, item) => sum + item.estimated_minutes, 0)} min</span><details><summary aria-label={`Afficher les activités de ${track.title}`}>Explorer <span>↓</span></summary><div className="track-module-popover">{trackModules.length ? trackModules.map((item) => <div key={item.id}><b>{item.title}</b><small>{item.estimated_minutes} min · {item.summary}</small></div>) : <p>Les activités de ce parcours arrivent bientôt.</p>}</div></details></div></article>;
        })}</div> : <div className="educator-no-resources"><span>📚</span><div><b>Les parcours arrivent bientôt</b><p>Les ressources publiées dans Supabase apparaîtront ici, classées par tranche d’âge.</p></div></div>}
      </section>
      <footer className="educator-footer"><SosLogo/><p>Accompagner les jeunes, à chaque étape de leur vie numérique.</p><a href="https://www.sos-senegal.org/" target="_blank" rel="noreferrer">SOS Villages d’Enfants Sénégal ↗</a></footer>
    </div>
  </main>;
}
