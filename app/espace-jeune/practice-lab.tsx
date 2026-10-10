"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../../src/lib/supabase/client";

type AgeBand = "6-8" | "9-11" | "12-15" | "16-18";
type MissionCode = "message-suspect" | "identite-numerique" | "enquete-information";
type MissionId = "message-suspect-01" | "identite-numerique-02" | "enquete-information-03" | "message-suspect-04" | "enquete-information-05" | "identite-numerique-06" | "message-suspect-07" | "enquete-information-08" | "identite-numerique-09" | "message-suspect-10" | "identite-numerique-11" | "enquete-information-12" | "message-suspect-13" | "enquete-information-14" | "identite-numerique-15" | "message-suspect-16";
type Attempt = { id: string; mission_code: MissionId | MissionCode; attempt_number: number; status: "completed" | "retry"; score: number; demonstrated_criteria: Record<string, boolean | number>; created_at: string };
type Mission = { code: MissionCode; title: string; skill: string; duration: string; description: string; scenario: string; instruction: string };
type Stage = { id: MissionId; family: MissionCode; level: number; title: string; skill: string; duration: string; description: string; scenario: string; instruction: string };

const levelNames = ["Débutant", "Intermédiaire", "Avancé", "Expert"];
const starsForScore = (score: number) => score >= 90 ? 3 : score >= 70 ? 2 : 1;
const stages: Stage[] = [
  { id: "message-suspect-01", family: "message-suspect", level: 0, title: "Le cadeau qui presse", skill: "Repérer une urgence suspecte", duration: "4 min", description: "Un message promet des étoiles gratuites si Awa agit vite.", scenario: "Awa reçoit une fausse promesse de cadeau dans son jeu préféré.", instruction: "Repère les indices et choisis une réaction sûre." },
  { id: "identite-numerique-02", family: "identite-numerique", level: 0, title: "Le profil d’Awa", skill: "Protéger ses informations", duration: "4 min", description: "Aide Awa à choisir ce qu’elle montre dans son profil fictif.", scenario: "Awa crée un profil pour un jeu. Toutes les informations sont inventées.", instruction: "Garde les informations personnelles privées et limite l’audience." },
  { id: "enquete-information-03", family: "enquete-information", level: 0, title: "La rumeur de l’école", skill: "Vérifier avant de croire", duration: "5 min", description: "Une rumeur annonce la fermeture d’une école fictive.", scenario: "Un message affirme que l’École des Baobabs sera fermée demain.", instruction: "Regarde les indices et dis si l’annonce peut être confirmée." },
  { id: "message-suspect-04", family: "message-suspect", level: 0, title: "Le faux concours", skill: "Ne pas donner son mot de passe", duration: "5 min", description: "Un concours demande un secret pour remettre un prix.", scenario: "Un compte fictif propose à Awa un cadeau, à condition qu’elle envoie son mot de passe.", instruction: "Trouve ce qui doit t’alerter puis choisis quoi faire." },
  { id: "enquete-information-05", family: "enquete-information", level: 1, title: "La photo sans contexte", skill: "Comparer plusieurs indices", duration: "6 min", description: "Une image ancienne accompagne une nouvelle inquiétante.", scenario: "Une publication partage une vieille photo en disant qu’elle montre un événement d’aujourd’hui.", instruction: "Examine les éléments disponibles avant de croire ou partager." },
  { id: "identite-numerique-06", family: "identite-numerique", level: 1, title: "La rencontre en ligne", skill: "Choisir ce qu’on partage", duration: "6 min", description: "Un nouveau contact pose des questions personnelles.", scenario: "Un personnage fictif reçoit une demande de nom d’école et d’endroit habituel.", instruction: "Décide quelles informations garder privées et règle l’audience." },
  { id: "message-suspect-07", family: "message-suspect", level: 1, title: "Le faux message d’un ami", skill: "Vérifier l’expéditeur", duration: "6 min", description: "Un message inhabituel semble venir d’une personne connue.", scenario: "Moussa reçoit d’un compte imitant son ami une demande urgente de code de connexion.", instruction: "Repère les indices et choisis comment vérifier sans partager de secret." },
  { id: "enquete-information-08", family: "enquete-information", level: 1, title: "La vidéo étonnante", skill: "Vérifier une vidéo virale", duration: "7 min", description: "Une vidéo impressionnante circule sans auteur ni date.", scenario: "Une courte vidéo affirme montrer une scène récente au Sénégal, mais son origine n’est pas indiquée.", instruction: "Examine les sources et choisis une conclusion prudente." },
  { id: "identite-numerique-09", family: "identite-numerique", level: 2, title: "La photo de groupe", skill: "Respecter le choix des autres", duration: "7 min", description: "Une photo révèle des détails sur plusieurs personnes.", scenario: "Un personnage veut publier une photo de groupe où l’on voit un uniforme et un lieu reconnaissable.", instruction: "Réduis les informations visibles et choisis une audience appropriée." },
  { id: "message-suspect-10", family: "message-suspect", level: 2, title: "Le QR code mystère", skill: "Évaluer un lien inattendu", duration: "7 min", description: "Un faux QR code promet une récompense immédiate.", scenario: "Une affiche fictive promet des crédits gratuits et pousse à scanner un code inconnu.", instruction: "Analyse les signaux de pression et choisis une réaction qui protège le compte." },
  { id: "identite-numerique-11", family: "identite-numerique", level: 2, title: "La localisation cachée", skill: "Repérer les détails qui localisent", duration: "8 min", description: "Une publication peut révéler un lieu et une routine.", scenario: "Un personnage prépare une publication de sport qui montre son terrain habituel et son horaire.", instruction: "Repère ce qui peut aider à localiser la personne et ajuste le profil." },
  { id: "enquete-information-12", family: "enquete-information", level: 2, title: "La source imitée", skill: "Vérifier l’origine d’une annonce", duration: "8 min", description: "Un compte ressemble à une source officielle sans la prouver.", scenario: "Une annonce urgente utilise le logo d’un service fictif, mais son compte et sa date sont incertains.", instruction: "Distingue l’apparence d’une preuve et décide si l’information peut être relayée." },
  { id: "message-suspect-13", family: "message-suspect", level: 3, title: "Le compte à récupérer", skill: "Réagir à une tentative de vol", duration: "9 min", description: "Un faux support technique réclame un code de récupération.", scenario: "Un message fictif affirme qu’un compte sera supprimé et demande un code de sécurité.", instruction: "Évalue les signaux d’arnaque et choisis une réponse qui limite les dégâts." },
  { id: "enquete-information-14", family: "enquete-information", level: 3, title: "La rumeur amplifiée", skill: "Distinguer répétition et preuve", duration: "9 min", description: "Des partages nombreux répètent une annonce sans source.", scenario: "Une information urgente est repartagée partout, mais aucun document récent ne la confirme.", instruction: "Confronte les sources, formule une conclusion et décide si tu partages." },
  { id: "identite-numerique-15", family: "identite-numerique", level: 3, title: "Le portfolio public", skill: "Maîtriser sa présence numérique", duration: "9 min", description: "Un profil créatif doit rester utile sans exposer sa vie privée.", scenario: "Un jeune prépare un portfolio public pour présenter ses projets et ses compétences.", instruction: "Garde les coordonnées, lieux et habitudes privés tout en choisissant une audience adaptée." },
  { id: "message-suspect-16", family: "message-suspect", level: 3, title: "La mission finale", skill: "Combiner plusieurs bons réflexes", duration: "10 min", description: "Une fausse alerte mélange urgence, lien et demande de code.", scenario: "Un message imite une plateforme connue, annonce une urgence et réclame un code confidentiel.", instruction: "Analyse tous les indices et choisis la meilleure façon de protéger le compte." },
];

const ageCopy: Record<AgeBand, Record<MissionCode, Omit<Mission, "code">>> = {
  "6-8": {
    "message-suspect": { title: "Le message au cadeau surprise", skill: "Demander conseil avant de cliquer", duration: "5 min", description: "Un jeu te promet un cadeau si tu vas très vite.", scenario: "Awa, un personnage inventé, reçoit un message qui promet des étoiles gratuites dans son jeu.", instruction: "Trouve ce qui te semble bizarre, puis choisis comment protéger Awa." },
    "identite-numerique": { title: "Le profil d’Awa", skill: "Garder ses informations privées", duration: "4 min", description: "Aide un personnage fictif à régler son profil.", scenario: "Awa prépare une petite carte de profil pour un jeu. Toutes les informations affichées sont inventées.", instruction: "Choisis ce qui doit rester secret et qui peut voir le profil." },
    "enquete-information": { title: "La rumeur de l’école", skill: "Vérifier avant de croire", duration: "5 min", description: "Une rumeur circule : est-elle vérifiée ?", scenario: "Un message dit que l’École des Baobabs, une école fictive, sera fermée demain.", instruction: "Regarde les deux indices, puis décide si l’information est confirmée." },
  },
  "9-11": {
    "message-suspect": { title: "Alerte au message suspect", skill: "Repérer une tentative d’arnaque", duration: "6 min", description: "Examine un message de jeu avant de décider quoi faire.", scenario: "Moussa reçoit une notification qui promet un lot et demande son mot de passe.", instruction: "Examine l’expéditeur et le lien fictif, repère les indices et choisis une réaction sûre." },
    "identite-numerique": { title: "Protège le profil de Moussa", skill: "Protéger ses données personnelles", duration: "6 min", description: "Règle un profil fictif sans trop en dévoiler.", scenario: "Moussa prépare un profil de jeu fictif. Tu peux choisir ce qui est visible et limiter son audience.", instruction: "Décide quelles informations garder privées, puis règle la visibilité du profil." },
    "enquete-information": { title: "Enquêteur de l’information", skill: "Comparer les sources", duration: "7 min", description: "Une publication partage une annonce sans preuve récente.", scenario: "Une publication affirme que l’École des Baobabs sera fermée demain. Cette école et tous les documents de l’exercice sont fictifs.", instruction: "Consulte les sources simulées, évalue les preuves et choisis quoi faire avant de partager." },
  },
  "12-15": {
    "message-suspect": { title: "Alerte au message suspect", skill: "Analyser les signaux d’hameçonnage", duration: "8 min", description: "Repère les signaux de manipulation dans un message.", scenario: "Un compte prétendant représenter un jeu populaire annonce un lot limité et réclame des identifiants.", instruction: "Vérifie l’expéditeur, l’urgence, le lien et la demande d’identifiants, puis sélectionne une réponse proportionnée." },
    "identite-numerique": { title: "Protège ton identité numérique", skill: "Maîtriser les informations exposées", duration: "8 min", description: "Mesure l’exposition d’un profil fictif et ajuste ses réglages.", scenario: "Tu aides un personnage fictif à préparer son profil public pour un espace de jeu.", instruction: "Évalue chaque donnée, distingue ce qui peut être publié et choisis une audience adaptée." },
    "enquete-information": { title: "Enquêteur de l’information", skill: "Évaluer l’origine et la qualité d’une information", duration: "9 min", description: "Compare dates, auteurs et sources avant de conclure.", scenario: "Une capture affirme qu’une école fictive sera fermée demain. Le message est largement partagé, mais les éléments fournis sont incomplets.", instruction: "Examine les preuves disponibles, identifie leurs limites et choisis une conclusion prudente." },
  },
  "16-18": {
    "message-suspect": { title: "Alerte au message suspect", skill: "Analyser une tentative d’hameçonnage", duration: "9 min", description: "Évalue une tentative de vol de compte et sa stratégie de pression.", scenario: "Un message imite un service de jeu, utilise l’urgence et dirige vers un domaine fictif pour voler un compte.", instruction: "Évalue les indices techniques et le mécanisme de pression, puis choisis une réponse qui limite le risque." },
    "identite-numerique": { title: "Protège ton identité numérique", skill: "Arbitrer la visibilité d’un profil", duration: "9 min", description: "Réduis l’exposition d’un profil fictif selon son usage.", scenario: "Un personnage prépare un profil destiné à rencontrer une communauté autour de ses projets créatifs.", instruction: "Garde les coordonnées, les lieux et les habitudes privées, puis limite l’audience au besoin réel." },
    "enquete-information": { title: "Enquêteur de l’information", skill: "Vérifier une affirmation et expliciter l’incertitude", duration: "10 min", description: "Confronte des sources simulées et distingue preuve et répétition.", scenario: "Une annonce de fermeture d’école circule avec beaucoup de partages, mais sans confirmation actuelle.", instruction: "Évalue la date, l’auteur, l’origine et la corroboration avant de conclure ou de relayer." },
  },
};

const missionIcons: Record<MissionCode, string> = { "message-suspect": "🛡️", "identite-numerique": "🪪", "enquete-information": "🔎" };
const simulatedMessages: Partial<Record<MissionId, { sender: string; email: string; text: string; link: string }>> = {
  "message-suspect-01": { sender: "Service cadeaux du jeu", email: "cadeau@jeu-cadeau.example", text: "Tu as gagné des étoiles gratuites ! Confirme dans les 5 minutes.", link: "https://jeu-cadeau.example/confirmer" },
  "message-suspect-04": { sender: "Grand concours", email: "prix@concours.example", text: "Pour recevoir ton cadeau, envoie ton mot de passe tout de suite.", link: "https://concours.example/gagner" },
  "message-suspect-07": { sender: "Le compte de ton ami", email: "moussa.ami@messages.example", text: "C’est urgent, envoie-moi le code reçu sur ton téléphone.", link: "https://messages.example/aide" },
  "message-suspect-10": { sender: "Récompense surprise", email: "points@qr-reward.example", text: "Scanne ce code pour recevoir tes points avant ce soir.", link: "https://qr-reward.example/scan" },
  "message-suspect-13": { sender: "Assistance compte", email: "support@compte-aide.example", text: "Ton compte sera fermé. Donne-nous ton code de récupération.", link: "https://compte-aide.example/recuperer" },
  "message-suspect-16": { sender: "Sécurité de la plateforme", email: "securite@plateforme-check.example", text: "Dernier rappel : ton compte sera bloqué. Confirme ton mot de passe et ton code.", link: "https://plateforme-check.example/urgence" },
};
const simulatedPosts: Partial<Record<MissionId, { headline: string; metadata: string }>> = {
  "enquete-information-03": { headline: "« L’École des Baobabs ferme demain, partage vite ! »", metadata: "Capture transférée · date et auteur inconnus" },
  "enquete-information-05": { headline: "« Cette photo montre un événement d’aujourd’hui »", metadata: "Image ancienne · origine non indiquée" },
  "enquete-information-08": { headline: "« Cette vidéo prouve qu’un événement vient d’arriver »", metadata: "Vidéo virale · auteur et date absents" },
  "enquete-information-12": { headline: "« Une nouvelle règle vient d’être annoncée »", metadata: "Compte ressemblant à une source officielle · identité non confirmée" },
  "enquete-information-14": { headline: "« Tout le monde le partage, c’est forcément vrai »", metadata: "Nombreux partages · aucune preuve récente" },
};
const clues = [
  { id: "sender", label: "L’expéditeur n’est pas le compte officiel", detail: "L’adresse finit par @jeu-cadeau.example : ce domaine est fictif et ne correspond pas au jeu." },
  { id: "urgency", label: "Le message me presse d’agir vite", detail: "« Dans 5 minutes, ton compte sera bloqué » cherche à empêcher une vérification calme." },
  { id: "link", label: "Le lien mène vers un site inattendu", detail: "Le lien affiché utilise cadeau-jeu.example. Il ne mène nulle part et ne peut pas être ouvert." },
  { id: "password", label: "On me demande mon mot de passe", detail: "Un service sérieux ne devrait pas demander le mot de passe dans un message pour remettre un cadeau." },
];

const identityFields: Record<AgeBand, { id: string; label: string; fictiveValue: string; sensitive: boolean }[]> = {
  "6-8": [
    { id: "nickname", label: "Son prénom dans le jeu", fictiveValue: "Awa", sensitive: true },
    { id: "school", label: "Le nom de son école", fictiveValue: "École des Baobabs", sensitive: true },
    { id: "place", label: "L’endroit où elle joue souvent", fictiveValue: "Près de la grande porte bleue", sensitive: true },
  ],
  "9-11": [
    { id: "nickname", label: "Son prénom dans le jeu", fictiveValue: "Moussa", sensitive: true },
    { id: "school", label: "Le nom de son école", fictiveValue: "École des Baobabs", sensitive: true },
    { id: "place", label: "Son quartier", fictiveValue: "Grand Yoff (exemple fictif)", sensitive: true },
    { id: "interest", label: "Son activité préférée", fictiveValue: "Dessiner", sensitive: false },
  ],
  "12-15": [
    { id: "nickname", label: "Son prénom et nom", fictiveValue: "Moussa D. (personnage fictif)", sensitive: true },
    { id: "school", label: "Son établissement", fictiveValue: "Lycée des Baobabs (fictif)", sensitive: true },
    { id: "place", label: "Son lieu habituel", fictiveValue: "Terrain de sport du quartier", sensitive: true },
    { id: "routine", label: "Son horaire de retour", fictiveValue: "Tous les jours vers 18 h", sensitive: true },
    { id: "interest", label: "Un centre d’intérêt", fictiveValue: "Créer des affiches", sensitive: false },
  ],
  "16-18": [
    { id: "nickname", label: "Son nom complet", fictiveValue: "Moussa D. (personnage fictif)", sensitive: true },
    { id: "school", label: "Son établissement", fictiveValue: "Lycée des Baobabs (fictif)", sensitive: true },
    { id: "place", label: "Son adresse ou zone précise", fictiveValue: "Rue des Manguiers (adresse fictive)", sensitive: true },
    { id: "routine", label: "Ses horaires habituels", fictiveValue: "Disponible chaque jour à 18 h", sensitive: true },
    { id: "contact", label: "Son numéro de téléphone", fictiveValue: "+221 77 000 00 00 (fictif)", sensitive: true },
    { id: "interest", label: "Son projet créatif", fictiveValue: "Portfolio d’affiches", sensitive: false },
  ],
};

type Source = { id: string; title: string; preview: string; detail: string };
function getSources(band: AgeBand): Source[] {
  const sources: Source[] = [
    { id: "message", title: "Message transféré", preview: "« L’école ferme demain ! Faites suivre. »", detail: "Aucun nom d’auteur, aucune date de publication et aucun lien vers une annonce officielle." },
    { id: "page-officielle", title: "Page officielle fictive", preview: "Calendrier publié il y a plusieurs années", detail: "La page est présentée comme officielle, mais la dernière mise à jour date de 2022. Elle ne confirme pas la situation de demain." },
  ];
  if (band !== "6-8") sources.push({ id: "date", title: "Détail sur la date", preview: "La capture ne montre pas quand elle a été créée", detail: "La date du message original manque. Une capture ancienne peut circuler à nouveau hors contexte." });
  if (band === "12-15" || band === "16-18") sources.push({ id: "auteur", title: "À propos de l’auteur", preview: "Le compte qui partage la capture n’est pas identifié", detail: "Aucun responsable, établissement ou service n’est cité comme auteur de l’annonce." });
  if (band === "16-18") sources.push({ id: "source-croisee", title: "Vérification indépendante", preview: "Aucune seconde source récente n’est fournie", detail: "Le dossier ne contient pas de confirmation récente provenant d’un autre canal officiel." });
  return sources;
}

const defaultChoices = (band: AgeBand) => Object.fromEntries(identityFields[band].map((field) => [field.id, "public"])) as Record<string, "private" | "public">;

export default function PracticeLab({ band: rawBand }: { band: string }) {
  const band: AgeBand = rawBand in ageCopy ? rawBand as AgeBand : "9-11";
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loadingAttempts, setLoadingAttempts] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeCode, setActiveCode] = useState<MissionId | null>(null);
  const [activeLevel, setActiveLevel] = useState(0);
  const [step, setStep] = useState(0);
  const [selectedClues, setSelectedClues] = useState<string[]>([]);
  const [messageAction, setMessageAction] = useState("");
  const [choices, setChoices] = useState(defaultChoices(band));
  const [visibility, setVisibility] = useState("public");
  const [openedSources, setOpenedSources] = useState<string[]>([]);
  const [conclusion, setConclusion] = useState("");
  const [sharing, setSharing] = useState("");
  const [result, setResult] = useState<Attempt | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const client = createClient();
      if (!client) { if (alive) { setLoadError("La sauvegarde Supabase n’est pas configurée."); setLoadingAttempts(false); } return; }
      const { data, error } = await client.from("practice_attempts").select("id, mission_code, attempt_number, status, score, demonstrated_criteria, created_at").order("created_at", { ascending: false }).order("attempt_number", { ascending: false });
      if (!alive) return;
      setLoadingAttempts(false);
      if (error) setLoadError("Applique le script SQL du Laboratoire pour enregistrer et retrouver tes missions.");
      else setAttempts((current) => [...current, ...((data ?? []) as Attempt[]).filter((item) => !current.some((existing) => existing.id === item.id))].sort((a, b) => b.created_at.localeCompare(a.created_at) || b.attempt_number - a.attempt_number));
    };
    void load();
    return () => { alive = false; if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);

  const sources = useMemo(() => getSources(band), [band]);
  const visibleClues = band === "6-8" ? clues.slice(0, 2) : band === "9-11" ? clues.slice(0, 3) : clues;
  const messageActions = band === "6-8"
    ? [{ id: "open", label: "Je clique pour voir le cadeau." }, { id: "ask-adult", label: "Je demande de l’aide à un adulte." }]
    : band === "9-11"
      ? [{ id: "open", label: "J’ouvre le lien pour voir le cadeau." }, { id: "report", label: "Je signale le message dans cette simulation." }, { id: "ask-adult", label: "Je demande conseil à un adulte." }]
      : [{ id: "open", label: "J’ouvre le lien pour voir où il mène." }, { id: "report", label: "Je signale le message dans cette simulation." }, { id: "delete", label: "Je supprime le message sans répondre." }, { id: "ask-adult", label: "Je demande conseil à un adulte de confiance." }];
  const profileVisibleFields = identityFields[band].filter((field) => choices[field.id] === "public");
  const latestAttempt = (code: MissionId) => attempts.find((attempt) => attempt.mission_code === code);
  const isCompleted = (code: MissionId) => attempts.some((attempt) => attempt.mission_code === code && attempt.status === "completed");
  const completedMissions = stages.filter((stage) => isCompleted(stage.id)).length;
  const selectedStage = activeCode ? stages.find((stage) => stage.id === activeCode) ?? null : null;
  const activeFamily = selectedStage?.family ?? null;
  const selectedMission = selectedStage ? {
    ...ageCopy[band][selectedStage.family],
    ...selectedStage,
    code: selectedStage.family,
    instruction: band === "6-8" || band === "9-11"
      ? ageCopy[band][selectedStage.family].instruction
      : selectedStage.instruction,
  } : null;
  const currentMessage = activeCode ? simulatedMessages[activeCode] : undefined;
  const currentPost = activeCode ? simulatedPosts[activeCode] : undefined;
  const firstIncompleteIndex = stages.findIndex((stage) => !isCompleted(stage.id));
  const xp = completedMissions * 25;
  const isStageUnlocked = (stage: Stage) => { const index = stages.findIndex((item) => item.id === stage.id); return index === 0 || isCompleted(stages[index - 1].id); };
  const isLevelUnlocked = (level: number) => level === 0 || stages.filter((stage) => stage.level === level - 1).every((stage) => isCompleted(stage.id));
  const resetActivity = (code: MissionId) => {
    const stageIndex = stages.findIndex((stage) => stage.id === code);
    if (stageIndex > 0 && !isCompleted(stages[stageIndex - 1].id)) return;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false); setActiveCode(code); setStep(0); setResult(null); setSaveError("");
    setSelectedClues([]); setMessageAction(""); setChoices(defaultChoices(band)); setVisibility("public");
    setOpenedSources([]); setConclusion(""); setSharing("");
  };
  const speakInstruction = () => {
    if (!("speechSynthesis" in window) || !selectedMission) return;
    const synthesis = window.speechSynthesis;
    if (speaking && synthesis.speaking) { synthesis.pause(); setSpeaking(false); return; }
    if (synthesis.paused) { synthesis.resume(); setSpeaking(true); return; }
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${selectedMission.scenario} ${selectedMission.instruction}`);
    utterance.lang = "fr-FR"; utterance.rate = band === "6-8" ? 0.85 : 0.95;
    utterance.onstart = () => setSpeaking(true); utterance.onend = () => setSpeaking(false); utterance.onerror = () => setSpeaking(false);
    synthesis.speak(utterance);
  };

  const submitAttempt = async (code: MissionId, answers: Record<string, unknown>) => {
    const client = createClient();
    if (!client) { setSaveError("Impossible de se connecter à Supabase. La mission n’est pas enregistrée."); return; }
    setSaving(true); setSaveError("");
    const { data, error } = await client.rpc("submit_practice_attempt", { p_mission_code: code, p_answers: answers });
    setSaving(false);
    if (error) { setSaveError("La mission n’a pas pu être enregistrée. Vérifie la configuration Supabase et réessaie."); return; }
    const saved = data as Attempt;
    setResult(saved);
    setAttempts((current) => [saved, ...current.filter((attempt) => attempt.id !== saved.id)].sort((a, b) => b.created_at.localeCompare(a.created_at) || b.attempt_number - a.attempt_number));
  };

  const startFinalPhase = () => { if (activeFamily === "message-suspect" || activeFamily === "enquete-information") setStep(1); };

  return <section className="practice-lab" aria-labelledby="practice-lab-title">
    <div className="practice-lab-heading"><div><span className="learner-eyebrow">APPRENDRE EN JOUANT</span><h2 id="practice-lab-title">Le Laboratoire du numérique</h2><p>16 missions, 4 niveaux : réussis une étape pour ouvrir la suivante et faire grandir ton expérience.</p></div><div className="lab-age-pill">{band.replace("-", "–")} ans · adapté à ton âge</div></div>
    <div className="lab-safety-note"><span aria-hidden="true">🛡️</span><p><b>Un espace d’entraînement sûr.</b> Les personnes, profils, messages, liens et documents sont fictifs. Aucun lien extérieur ne s’ouvre et ne partage jamais tes vraies informations.</p></div>
    {loadError && <p className="lab-save-notice" role="status">{loadError}</p>}
    {!selectedMission ? <><div className="lab-overview" aria-label="Résumé de ta progression au laboratoire"><article><span>✦</span><div><b>{loadingAttempts ? "…" : loadError ? "—" : `${completedMissions} / ${stages.length}`}</b><small>{loadingAttempts ? "Chargement" : "missions réussies"}</small></div></article><article><span>⚡</span><div><b>{loadingAttempts ? "…" : loadError ? "—" : `${xp} XP`}</b><small>{loadingAttempts ? "Chargement" : "expérience gagnée"}</small></div></article><article><span>🧭</span><div><b>{loadingAttempts ? "…" : loadError ? "—" : firstIncompleteIndex < 0 ? "Tout terminé !" : `Étape ${String(firstIncompleteIndex + 1).padStart(2, "0")}`}</b><small>{loadingAttempts ? "Chargement" : firstIncompleteIndex < 0 ? "parcours expert" : `sur ${stages.length} · prochaine à jouer`}</small></div></article></div>
      <div className="lab-level-map" role="group" aria-label="Niveaux du laboratoire">{levelNames.map((name, index) => { const levelStages = stages.filter((stage) => stage.level === index); const passed = levelStages.filter((stage) => isCompleted(stage.id)).length; const unlocked = isLevelUnlocked(index); return <button type="button" className={`lab-level-card ${activeLevel === index ? "selected" : ""} ${!unlocked ? "locked" : ""} ${passed === levelStages.length ? "finished" : ""}`} key={name} disabled={!unlocked} onClick={() => setActiveLevel(index)}><span className="lab-level-number">{unlocked ? passed === levelStages.length ? "✓" : `0${index + 1}` : "🔒"}</span><span className="lab-level-copy"><b>{name}</b><small>{unlocked ? `${passed} / ${levelStages.length} missions réussies` : "Termine le niveau précédent"}</small><i><span style={{ width: `${(passed / levelStages.length) * 100}%` }}/></i></span><span className="lab-level-arrow">{unlocked ? "→" : "🔒"}</span></button>; })}</div>
      <div className="lab-level-heading"><div><span className="lab-kicker">NIVEAU 0{activeLevel + 1}</span><h3>{levelNames[activeLevel]}</h3><p>{stages.filter((stage) => stage.level === activeLevel).filter((stage) => isCompleted(stage.id)).length} missions sur 4 réussies · Chaque victoire ouvre la prochaine étape.</p></div><span>🏆 {stages.filter((stage) => stage.level === activeLevel).filter((stage) => isCompleted(stage.id)).length}/4</span></div>
      <div className="lab-mission-grid">{stages.filter((stage) => stage.level === activeLevel).map((stage, index) => { const last = latestAttempt(stage.id); const passed = isCompleted(stage.id); const unlocked = isStageUnlocked(stage); return <article className={`lab-mission-card lab-tone-${index % 3} ${!unlocked ? "is-locked" : ""} ${passed ? "is-complete" : ""}`} key={stage.id}><div className="lab-card-top"><span>{unlocked ? missionIcons[stage.family] : "🔒"}</span><small>ÉTAPE {String(stages.indexOf(stage) + 1).padStart(2, "0")} · {stage.duration}</small></div><span className="lab-skill">{stage.skill}</span><h3>{stage.title}</h3><p>{stage.description}</p><div className="lab-card-bottom"><span className={`lab-status ${passed ? "is-done" : last ? "is-retry" : ""}`}>{loadingAttempts ? "Chargement…" : loadError ? "Résultats indisponibles" : passed ? `✓ Réussie · +25 XP` : unlocked && last ? `À retenter · essai ${last.attempt_number}` : unlocked ? "À découvrir" : "Verrouillée"}</span><button type="button" disabled={!unlocked || loadingAttempts} onClick={() => resetActivity(stage.id)}>{passed ? "Rejouer" : unlocked && last ? "Continuer" : unlocked ? "Jouer" : "Verrouillée"}<span>{unlocked ? "→" : "🔒"}</span></button></div></article>; })}</div></> : <div className="lab-simulation">
      <div className="lab-simulation-top"><button type="button" className="lab-back" onClick={() => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); setActiveCode(null); setResult(null); }}>← Toutes les missions</button><span>{missionIcons[selectedMission.code]} {selectedMission.skill}</span><small>{selectedMission.duration}</small></div>
      <div className="lab-scenario"><div><span className="lab-kicker">SITUATION FICTIVE</span><p>{selectedMission.scenario}</p></div><button type="button" className={`lab-audio ${speaking ? "is-speaking" : ""}`} onClick={speakInstruction} aria-label={speaking ? "Mettre la consigne en pause" : "Écouter la consigne"}>{speaking ? "Ⅱ Pause" : "🔊 Écouter la consigne"}</button></div>
      {!result && <>
        {activeFamily === "message-suspect" && <div className="lab-activity"><div className="mock-message"><div className="mock-message-head"><span className="mock-mail-icon">✉</span><div><b>{currentMessage?.sender ?? "Message simulé"}</b><small>{currentMessage?.email} · message fictif</small></div><span className="mock-unverified">À vérifier</span></div><p>{currentMessage?.text}</p><div className="mock-link" aria-label="Lien fictif non cliquable">{currentMessage?.link}</div><small className="mock-warning">Simulation : ce lien est du texte fictif et ne peut pas être ouvert.</small></div>
          {step === 0 ? <><h3>{band === "6-8" ? "Qu’est-ce qui te paraît bizarre ?" : "Repère les indices suspects"}</h3><p className="lab-helper">{band === "6-8" ? "Tu peux choisir plusieurs réponses." : "Sélectionne tous les indices que tu as remarqués."}</p><div className="lab-choice-list">{visibleClues.map((clue) => <label className={`lab-check-choice ${selectedClues.includes(clue.id) ? "is-selected" : ""}`} key={clue.id}><input type="checkbox" checked={selectedClues.includes(clue.id)} onChange={(event) => setSelectedClues((current) => event.target.checked ? [...current, clue.id] : current.filter((id) => id !== clue.id))}/><span className="lab-checkbox-mark">{selectedClues.includes(clue.id) ? "✓" : ""}</span><span><b>{clue.label}</b><small>{clue.detail}</small></span></label>)}</div><button className="lab-primary-action" type="button" disabled={selectedClues.length === 0} onClick={startFinalPhase}>Choisir ma réaction <span>→</span></button></> : <><h3>Que fais-tu maintenant ?</h3><p className="lab-helper">Le bon réflexe est de ne pas ouvrir le lien et de demander de l’aide si tu hésites.</p><div className="lab-radio-list">{messageActions.map((item) => <label className={`lab-radio-choice ${messageAction === item.id ? "is-selected" : ""}`} key={item.id}><input type="radio" name="message-action" value={item.id} checked={messageAction === item.id} onChange={() => setMessageAction(item.id)}/><span className="lab-radio-mark"/>{item.label}</label>)}</div><button className="lab-primary-action" type="button" disabled={!messageAction || saving} onClick={() => void submitAttempt(activeCode!, { clues: selectedClues, action: messageAction })}>{saving ? "Enregistrement…" : "Terminer la simulation"}<span>✓</span></button></>}
        </div>}
        {activeFamily === "identite-numerique" && <div className="lab-activity"><div className="mock-profile"><div className="mock-profile-avatar" aria-hidden="true">{band === "6-8" ? "👧🏾" : "🧑🏾‍🎨"}</div><div><span>PROFIL FICTIF</span><b>{band === "6-8" ? "Awa" : "Moussa"}</b><small>Une personne inventée pour cette mission</small></div><div className="mock-visibility">{visibility === "contacts" ? "👥 Contacts" : "🌍 Public"}</div></div><h3>{selectedMission.instruction}</h3><p className="lab-helper">Fais tes choix. Observe quelles informations restent visibles dans le profil fictif.</p><div className="profile-builder">{identityFields[band].map((field) => <div className="profile-field" key={field.id}><div><b>{field.label}</b><small>{field.fictiveValue}</small></div><div className="profile-visibility-toggle" role="group" aria-label={`Visibilité de ${field.label}`}><button type="button" aria-pressed={choices[field.id] === "private"} onClick={() => setChoices((current) => ({ ...current, [field.id]: "private" }))}>🔒 Privé</button><button type="button" aria-pressed={choices[field.id] === "public"} onClick={() => setChoices((current) => ({ ...current, [field.id]: "public" }))}>Visible</button></div></div>)}</div><div className="profile-preview"><b>Ce que le public voit</b>{profileVisibleFields.length ? <div>{profileVisibleFields.map((field) => <span key={field.id}>{field.label}: {field.fictiveValue}</span>)}</div> : <small>Aucune information personnelle visible.</small>}</div><div className="profile-audience"><b>Qui peut voir ce profil ?</b><div className="profile-visibility-toggle"><button type="button" aria-pressed={visibility === "contacts"} onClick={() => setVisibility("contacts")}>👥 Contacts</button><button type="button" aria-pressed={visibility === "public"} onClick={() => setVisibility("public")}>🌍 Tout le monde</button></div></div><div className={`profile-consequence ${Object.entries(choices).filter(([key, value]) => value === "public" && identityFields[band].find((item) => item.id === key)?.sensitive).length || visibility === "public" ? "risk" : "safe"}`}><span>{Object.entries(choices).filter(([key, value]) => value === "public" && identityFields[band].find((item) => item.id === key)?.sensitive).length || visibility === "public" ? "⚠️" : "✓"}</span><p>{Object.entries(choices).filter(([key, value]) => value === "public" && identityFields[band].find((item) => item.id === key)?.sensitive).length ? "Des informations qui peuvent aider à reconnaître ou localiser la personne seraient visibles." : visibility === "public" ? "Le profil reste visible à tous : limite son audience si ce n’est pas nécessaire." : "Les informations sensibles sont privées et le profil est limité aux contacts."}</p></div><button className="lab-primary-action" type="button" disabled={saving} onClick={() => void submitAttempt(activeCode!, { choices, visibility })}>{saving ? "Enregistrement…" : "Vérifier mes réglages"}<span>✓</span></button></div>}
        {activeFamily === "enquete-information" && <div className="lab-activity"><div className="mock-post"><span className="lab-kicker">PUBLICATION FICTIVE · NON VÉRIFIÉE</span><b>{currentPost?.headline ?? "Publication fictive à vérifier"}</b><small>{currentPost?.metadata ?? "Origine et date à vérifier"}</small></div>{step === 0 ? <><h3>Examine les éléments disponibles</h3><p className="lab-helper">Ouvre au moins deux sources simulées pour les comparer.</p><div className="lab-source-list">{sources.map((source) => { const opened = openedSources.includes(source.id); return <article className={`lab-source ${opened ? "is-open" : ""}`} key={source.id}><div><span className="source-icon">{opened ? "✓" : "⌕"}</span><div><b>{source.title}</b><small>{source.preview}</small>{opened && <p>{source.detail}</p>}</div></div><button type="button" aria-expanded={opened} onClick={() => setOpenedSources((current) => opened ? current.filter((id) => id !== source.id) : [...current, source.id])}>{opened ? "Refermer" : "Examiner"}</button></article>; })}</div><button className="lab-primary-action" type="button" disabled={openedSources.length < 2} onClick={startFinalPhase}>Formuler ma conclusion <span>→</span></button></> : <><h3>Quelle conclusion peux-tu justifier ?</h3><p className="lab-helper">Tu n’as pas besoin de deviner : dis ce que les preuves permettent réellement d’affirmer.</p><div className="lab-radio-list">{[{ id: "confirmed", label: "L’annonce est confirmée." }, { id: "doubtful", label: "L’annonce semble douteuse." }, { id: "impossible", label: "Impossible à vérifier avec ces éléments." }].map((item) => <label className={`lab-radio-choice ${conclusion === item.id ? "is-selected" : ""}`} key={item.id}><input type="radio" name="information-conclusion" checked={conclusion === item.id} onChange={() => setConclusion(item.id)}/><span className="lab-radio-mark"/>{item.label}</label>)}</div><h3 className="lab-subquestion">Et avant de partager ?</h3><div className="lab-radio-list">{[{ id: "share", label: "Je la partage pour prévenir les autres." }, { id: "wait", label: "J’attends une confirmation récente." }].map((item) => <label className={`lab-radio-choice ${sharing === item.id ? "is-selected" : ""}`} key={item.id}><input type="radio" name="information-sharing" checked={sharing === item.id} onChange={() => setSharing(item.id)}/><span className="lab-radio-mark"/>{item.label}</label>)}</div><button className="lab-primary-action" type="button" disabled={!conclusion || !sharing || saving} onClick={() => void submitAttempt(activeCode!, { openedSources, conclusion, sharing })}>{saving ? "Enregistrement…" : "Terminer l’enquête"}<span>✓</span></button></>}
        </div>}
      </>}
      {saveError && <p className="lab-error" role="alert">{saveError}</p>}
      {result && <section className={`lab-result ${result.status === "completed" ? "passed" : "needs-work"}`} aria-live="polite"><span className="lab-result-icon">{result.status === "completed" ? "✓" : "↻"}</span><div><span className="lab-kicker">{result.status === "completed" ? "SIMULATION RÉUSSIE" : "UNE NOUVELLE TENTATIVE T’AIDERA"}</span>{result.status === "completed" && <div className="lab-stars" aria-label={`${starsForScore(result.score)} étoiles obtenues`}>{"⭐".repeat(starsForScore(result.score))}</div>}<h3>{result.status === "completed" ? "Tu as appliqué les bons réflexes." : "Tu peux encore progresser."}</h3><p>{activeFamily === "message-suspect" ? "Repérer plusieurs indices et ne pas ouvrir le lien réduit le risque. En cas de doute, demande conseil à un adulte de confiance." : activeFamily === "identite-numerique" ? "Garder les données qui identifient ou localisent une personne privées, et limiter l’audience, réduit son exposition." : "Plusieurs partages ne remplacent pas une preuve récente. Ici, les éléments disponibles ne permettent pas de confirmer l’annonce : mieux vaut attendre."}</p><div className="lab-criteria">{Object.entries(result.demonstrated_criteria).map(([key, value]) => <span className={value === true ? "criterion-met" : "criterion-unmet"} key={key}>{value === true ? "✓" : value === false ? "○" : value} {key.replace(/_/g, " ")}</span>)}</div><small>Résultat de cette simulation, pas une certification officielle de compétence.</small><div className="lab-result-actions"><button type="button" onClick={() => { setActiveCode(null); setResult(null); }}>Carte des niveaux</button>{result.status === "completed" && selectedStage && stages.indexOf(selectedStage) < stages.length - 1 && <button type="button" onClick={() => { const next = stages[stages.indexOf(selectedStage) + 1]; setActiveLevel(next.level); resetActivity(next.id); }}>Étape suivante <span>→</span></button>}<button type="button" onClick={() => activeCode && resetActivity(activeCode)}>Rejouer <span>↻</span></button></div></div></section>}
      {!result && <p className="lab-privacy-footnote">Les résultats enregistrés contiennent uniquement les choix de cette simulation fictive. Aucun texte libre ni renseignement personnel n’est demandé.</p>}
    </div>}
    <p className="lab-footer-note">Une simulation réussie montre un bon raisonnement dans cet exercice. Elle ne remplace ni l’expérience ni l’accompagnement d’un adulte.</p>
  </section>;
}
