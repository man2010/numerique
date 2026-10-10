"use client";

import { useMemo, useState } from "react";

type Learner = { id: string; display_name: string; age_band: string | null };
type Progress = { learner_id: string; module_id: string; progress_percent: number; score: number | null; completed_at: string | null; updated_at: string };
type PracticeAttempt = { id: string; learner_id: string; mission_code: string; attempt_number: number; status: "completed" | "retry"; score: number; demonstrated_criteria: Record<string, boolean | number>; created_at: string };
type Module = { id: string; track_id: string; title: string; summary: string; estimated_minutes: number };
type Track = { id: string; title: string; age_min: number; age_max: number };

const ageNames: Record<string, string> = { "6-8": "6–8 ans", "9-11": "9–11 ans", "12-15": "12–15 ans", "16-18": "16–18 ans" };
const practiceMissionLabels: Record<string, string> = {
  "message-suspect-01": "Le cadeau qui presse", "identite-numerique-02": "Le profil d’Awa", "enquete-information-03": "La rumeur de l’école", "message-suspect-04": "Le faux concours",
  "enquete-information-05": "La photo sans contexte", "identite-numerique-06": "La rencontre en ligne", "message-suspect-07": "Le faux message d’un ami", "enquete-information-08": "La vidéo étonnante",
  "identite-numerique-09": "La photo de groupe", "message-suspect-10": "Le QR code mystère", "identite-numerique-11": "La localisation cachée", "enquete-information-12": "La source imitée",
  "message-suspect-13": "Le compte à récupérer", "enquete-information-14": "La rumeur amplifiée", "identite-numerique-15": "Le portfolio public", "message-suspect-16": "La mission finale",
  "message-suspect": "Message suspect", "identite-numerique": "Identité numérique", "enquete-information": "Enquête information",
};

function getAgeBand(ageBand: string | null) {
  return ageBand && ageNames[ageBand] ? ageNames[ageBand] : "Âge non renseigné";
}

function formatLastSeen(date: string | undefined) {
  if (!date) return "Aucune activité enregistrée";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Date indisponible";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(parsed);
}

export default function EducatorLearnerMonitor({ learners, progress, practiceAttempts, modules, tracks }: { learners: Learner[]; progress: Progress[]; practiceAttempts: PracticeAttempt[]; modules: Module[]; tracks: Track[] }) {
  const [query, setQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState("Tous les âges");
  const [sort, setSort] = useState("priority");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ageOptions = ["Tous les âges", ...Array.from(new Set(learners.map((learner) => getAgeBand(learner.age_band))).values()).filter((age) => age !== "Âge non renseigné")];
  const summaries = useMemo(() => learners.map((learner) => {
    const activity = progress.filter((item) => item.learner_id === learner.id);
    const completed = activity.filter((item) => item.completed_at).length;
    const active = activity.filter((item) => item.progress_percent > 0 && !item.completed_at).length;
    const scores = activity.filter((item) => item.score !== null);
    const average = scores.length ? Math.round(scores.reduce((total, item) => total + (item.score ?? 0), 0) / scores.length) : null;
    const lastActivity = activity.reduce<string | undefined>((latest, item) => !latest || item.updated_at > latest ? item.updated_at : latest, undefined);
    const priority = completed === 0 && active === 0 ? 3 : average !== null && average < 60 ? 2 : active > 0 ? 1 : 0;
    return { learner, activity, completed, active, average, lastActivity, priority };
  }), [learners, progress]);
  const visible = summaries.filter(({ learner }) => learner.display_name.toLocaleLowerCase("fr").includes(query.trim().toLocaleLowerCase("fr")) && (ageFilter === "Tous les âges" || getAgeBand(learner.age_band) === ageFilter)).sort((a, b) => {
    if (sort === "name") return a.learner.display_name.localeCompare(b.learner.display_name, "fr");
    if (sort === "recent") return (b.lastActivity ?? "").localeCompare(a.lastActivity ?? "");
    return b.priority - a.priority || a.learner.display_name.localeCompare(b.learner.display_name, "fr");
  });
  const selected = summaries.find(({ learner }) => learner.id === selectedId);
  const selectedTrack = selected ? tracks.find((track) => track.age_min <= (Number.parseInt(selected.learner.age_band?.split("-")[0] ?? "0", 10)) && track.age_max >= Number.parseInt(selected.learner.age_band?.split("-")[1] ?? "0", 10)) : undefined;
  const selectedModules = selectedTrack ? modules.filter((module) => module.track_id === selectedTrack.id) : [];
  const selectedProgress = new Map(selected?.activity.map((item) => [item.module_id, item]) ?? []);
  const completedCount = selectedModules.filter((module) => selectedProgress.get(module.id)?.completed_at).length;
  const progressPercent = selectedModules.length ? Math.round((completedCount / selectedModules.length) * 100) : 0;

  const recommendation = !selected || selected.activity.length === 0
    ? "Propose-lui de commencer par une activité courte, puis demande-lui ce qu’il ou elle en retient."
    : selected.average !== null && selected.average < 60
      ? "Reprends avec lui ou elle une situation concrète du quiz et invite-le·la à expliquer son choix, sans jugement."
      : selected.completed >= selectedModules.length && selectedModules.length > 0
        ? "Son parcours est terminé : félicite ses progrès et choisis ensemble un nouveau thème à explorer."
        : "Félicite chaque étape franchie et demande-lui quel réflexe lui semble le plus utile au quotidien.";

  return <div className="educator-monitor">
    <div className="educator-monitor-controls">
      <label className="educator-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un jeune…" aria-label="Rechercher un jeune par son nom" /></label>
      <label className="educator-filter"><span>Âge</span><select value={ageFilter} onChange={(event) => setAgeFilter(event.target.value)} aria-label="Filtrer les jeunes par tranche d’âge">{ageOptions.map((age) => <option key={age}>{age}</option>)}</select></label>
      <label className="educator-filter educator-sort"><span>Trier</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Trier la liste des jeunes"><option value="priority">À accompagner</option><option value="recent">Activité récente</option><option value="name">Ordre alphabétique</option></select></label>
    </div>
    <div className="educator-monitor-summary"><span>{visible.length} jeune{visible.length === 1 ? "" : "s"} affiché{visible.length === 1 ? "" : "s"}</span><span><i/> La priorité aide à organiser l’accompagnement, sans évaluer les jeunes.</span></div>
    {visible.length ? <div className="educator-monitor-list">{visible.map(({ learner, completed, active, average, lastActivity, priority }, index) => {
      const isSelected = selectedId === learner.id;
      const priorityLabel = priority === 3 ? "À découvrir" : priority === 2 ? "À reprendre ensemble" : priority === 1 ? "En cours" : "Belle progression";
      return <button className={`educator-monitor-card ${isSelected ? "selected" : ""}`} key={learner.id} type="button" aria-expanded={isSelected} onClick={() => setSelectedId(isSelected ? null : learner.id)}>
        <span className={`learner-avatar educator-avatar avatar-${index % 4}`}>{learner.display_name.trim().charAt(0).toUpperCase() || "J"}</span>
        <span className="educator-monitor-person"><b>{learner.display_name}</b><small>{getAgeBand(learner.age_band)} · {completed} quiz validé{completed === 1 ? "" : "s"}</small></span>
        <span className={`educator-priority priority-${priority}`}><i/>{priorityLabel}</span>
        <span className="educator-monitor-score"><b>{average === null ? "—" : `${average}%`}</b><small>{average === null ? "pas encore de score" : "score moyen"}</small></span>
        <span className="educator-monitor-open" aria-hidden="true">{isSelected ? "−" : "→"}</span>
        <span className="educator-monitor-hidden">{active} activité{active === 1 ? "" : "s"} en cours · {formatLastSeen(lastActivity)}</span>
      </button>;
    })}</div> : <div className="educator-monitor-empty"><span>⌕</span><b>Aucun résultat</b><p>Essaie un autre nom ou une autre tranche d’âge.</p></div>}
    {selected && <section className="educator-learner-detail" aria-live="polite">
      <div className="learner-detail-heading"><div><span className="educator-kicker">SUIVI INDIVIDUEL</span><h3>{selected.learner.display_name}</h3><p>{getAgeBand(selected.learner.age_band)} · Dernière activité : {formatLastSeen(selected.lastActivity)}</p></div><button type="button" onClick={() => setSelectedId(null)} aria-label="Fermer le suivi individuel">×</button></div>
      <div className="learner-detail-stats"><div><b>{selected.completed}{selectedModules.length ? ` / ${selectedModules.length}` : ""}</b><small>quiz validés</small></div><div><b>{selected.average === null ? "—" : `${selected.average}%`}</b><small>score moyen</small></div><div><b>{selected.active}</b><small>en cours</small></div></div>
      <div className="learner-detail-progress"><div><b>Avancement du parcours</b><span>{selectedModules.length ? `${progressPercent}%` : "Parcours indisponible"}</span></div><i><span style={{ width: `${progressPercent}%` }}/></i></div>
      {selectedModules.length ? <div className="learner-detail-modules">{selectedModules.map((module) => { const item = selectedProgress.get(module.id); const status = item?.completed_at ? "Validé" : item?.progress_percent ? `${item.progress_percent}% commencé` : "À découvrir"; return <article key={module.id}><span className={item?.completed_at ? "module-done" : ""}>{item?.completed_at ? "✓" : "○"}</span><div><b>{module.title}</b><small>{module.estimated_minutes} min · {status}{item?.score !== null && item?.score !== undefined ? ` · score ${item.score}%` : ""}</small></div></article>; })}</div> : <p className="learner-detail-no-track">Aucun parcours publié ne correspond actuellement à sa tranche d’âge.</p>}
      <div className="learner-practice-results"><div className="practice-results-heading"><div><span className="educator-kicker">MISES EN PRATIQUE</span><b>Laboratoire du numérique</b></div><span>{practiceAttempts.filter((attempt) => attempt.learner_id === selected.learner.id).length} tentative{practiceAttempts.filter((attempt) => attempt.learner_id === selected.learner.id).length === 1 ? "" : "s"}</span></div>{practiceAttempts.filter((attempt) => attempt.learner_id === selected.learner.id).length ? <div className="practice-result-list">{practiceAttempts.filter((attempt) => attempt.learner_id === selected.learner.id).slice(0, 8).map((attempt) => { const criteria = Object.entries(attempt.demonstrated_criteria).filter(([key]) => key !== "indices_reperes" && key !== "sources_consultees" && key !== "informations_protegees" && key !== "informations_a_proteger"); const metCount = criteria.filter(([, value]) => value === true).length; return <article key={attempt.id}><span className={attempt.status === "completed" ? "practice-result-check is-complete" : "practice-result-check"}>{attempt.status === "completed" ? "✓" : "↻"}</span><div><b>{practiceMissionLabels[attempt.mission_code] ?? attempt.mission_code}</b><small>{attempt.status === "completed" ? "Simulation réussie" : "À retravailler"} · Essai {attempt.attempt_number} · {attempt.score}% · {metCount}/{criteria.length} critères cochés</small></div><time>{new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(new Date(attempt.created_at))}</time></article>; })}</div> : <p className="practice-results-empty">Aucune mission pratique enregistrée pour le moment. Les simulations réussies ne constituent pas à elles seules une certification de compétence.</p>}</div>
      <aside className="educator-recommendation"><span>✦</span><div><b>Une piste pour votre prochain échange</b><p>{recommendation}</p></div></aside>
    </section>}
  </div>;
}
