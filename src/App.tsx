import { useState, type ReactNode } from "react";

type IconName =
  | "home"
  | "book"
  | "trophy"
  | "profile"
  | "settings"
  | "bell"
  | "play"
  | "clock"
  | "check"
  | "lock"
  | "shield"
  | "sparkle"
  | "arrow"
  | "star"
  | "headphones"
  | "volume"
  | "flame"
  | "globe"
  | "award"
  | "close";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v17H7.5A3.5 3.5 0 0 0 4 22Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v17h3.5a3.5 3.5 0 0 1 3.5 3Z" /></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0Z" /><path d="M7 6H3v1a5 5 0 0 0 5 5M17 6h4v1a5 5 0 0 1-5 5" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    play: <path d="m9 7 8 5-8 5Z" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    shield: <><path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
    sparkle: <><path d="m12 3 1.3 4.3L18 9l-4.7 1.7L12 15l-1.3-4.3L6 9l4.7-1.7Z" /><path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6Z" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    star: <path d="m12 2 3 6 7 .9-5 4.8 1.2 6.8L12 17.3l-6.2 3.2L7 13.7 2 8.9 9 8Z" />,
    headphones: <><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><path d="M4 14h3v6H5a1 1 0 0 1-1-1ZM20 14h-3v6h2a1 1 0 0 0 1-1Z" /></>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4Z" /><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12" /></>,
    flame: <path d="M12 22c4 0 7-2.8 7-7 0-3.5-2-6.5-5.5-10.5.2 3-1.4 4.4-2.7 5.4-.2-2-1.2-3.5-2.5-4.9C8 9 5 11 5 15c0 4.2 3 7 7 7Z" />,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></>,
    award: <><circle cx="12" cy="9" r="6" /><path d="m8 14-1 8 5-3 5 3-1-8M9.5 9l1.5 1.5L14.5 7" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function SosLogo() {
  return (
    <div className="brand" aria-label="SOS Villages d'Enfants Sénégal">
      <svg className="brand-mark" viewBox="0 0 54 54" role="img" aria-hidden="true">
        <path d="M6 24 27 8l21 16" />
        <path d="M10 25c3-3 7-3 10 0l7 7 7-7c3-3 7-3 10 0" />
        <circle cx="27" cy="20" r="4" />
        <path d="M27 25v17M18 34l9 8 9-8" />
      </svg>
      <div className="brand-copy">
        <strong>SOS</strong>
        <span>Villages d&apos;Enfants</span>
        <small>SÉNÉGAL</small>
      </div>
    </div>
  );
}

const ageTracks = [
  { age: "6–8", name: "Découvrir", color: "coral", description: "Je découvre en images" },
  { age: "9–11", name: "Comprendre", color: "yellow", description: "J'apprends les bons réflexes" },
  { age: "12–15", name: "Évaluer", color: "violet", description: "J'analyse les situations" },
  { age: "16–18", name: "Utiliser", color: "green", description: "Je maîtrise mes usages" },
];

const moduleSets = [
  [
    { title: "Mon écran et moi", kicker: "Premiers pas", duration: "4 min", icon: "👀", color: "blue", progress: 100 },
    { title: "Mon secret magique", kicker: "Mot de passe", duration: "5 min", icon: "🔑", color: "yellow", progress: 45 },
    { title: "Si quelque chose me gêne", kicker: "En parler", duration: "4 min", icon: "💬", color: "coral", progress: 0 },
  ],
  [
    { title: "Protège ton compte comme un pro", kicker: "Sécurité", duration: "8 min", icon: "🛡️", color: "blue", progress: 65 },
    { title: "Vrai, faux… ou presque ?", kicker: "Esprit critique", duration: "10 min", icon: "🔎", color: "yellow", progress: 0 },
    { title: "Le web n'oublie pas", kicker: "Vie privée", duration: "7 min", icon: "👣", color: "coral", progress: 0 },
  ],
  [
    { title: "Stop au cyberharcèlement", kicker: "Agir et aider", duration: "14 min", icon: "🤝", color: "violet", progress: 40 },
    { title: "Info ou intox ?", kicker: "Mise en situation", duration: "12 min", icon: "🧠", color: "yellow", progress: 0 },
    { title: "Mon identité numérique", kicker: "Réputation", duration: "11 min", icon: "🪪", color: "blue", progress: 0 },
  ],
  [
    { title: "Construire son profil pro", kicker: "Insertion", duration: "18 min", icon: "💼", color: "green", progress: 50 },
    { title: "L'IA, avec esprit critique", kicker: "Intelligence artificielle", duration: "16 min", icon: "✦", color: "violet", progress: 0 },
    { title: "Réseaux : garder le contrôle", kicker: "Autonomie", duration: "15 min", icon: "📱", color: "coral", progress: 0 },
  ],
];

const trackCopy = [
  { eyebrow: "Bienvenue, petit explorateur !", title: "Le numérique, c'est une aventure.", text: "On regarde, on écoute et on apprend ensemble.", cta: "Commencer l'aventure" },
  { eyebrow: "Bonjour, Adama !", title: "Prêt à devenir un pro du numérique ?", text: "Des défis courts pour comprendre Internet et apprendre à te protéger.", cta: "Continuer mon parcours" },
  { eyebrow: "À toi de jouer, Awa !", title: "Analyse. Choisis. Agis.", text: "Des situations réalistes pour repérer les risques et aider les autres.", cta: "Reprendre le défi" },
  { eyebrow: "Bienvenue, Moussa.", title: "Le numérique au service de ton avenir.", text: "Développe ton autonomie, ta présence en ligne et tes compétences pour demain.", cta: "Poursuivre mon parcours" },
];

const quizData = [
  {
    question: "Une personne que tu ne connais pas veut ta photo. Que fais-tu ?",
    options: ["Je lui envoie vite.", "Je dis non et j'appelle un adulte.", "Je demande une photo en retour."],
    correct: 1,
    explanation: "Bravo ! Une personne de confiance peut toujours t'aider à choisir.",
  },
  {
    question: "Un inconnu te demande ton mot de passe. Que fais-tu ?",
    options: ["Je le lui donne, il a l'air sympa.", "Je refuse et j'en parle à un adulte.", "Je lui donne seulement la moitié."],
    correct: 1,
    explanation: "Excellent réflexe ! Un mot de passe reste toujours secret.",
  },
  {
    question: "Un camarade reçoit des messages humiliants dans un groupe. Quelle est la meilleure réaction ?",
    options: ["Je transfère les messages.", "Je ne fais rien pour éviter les problèmes.", "Je garde une preuve, je le soutiens et j'alerte un adulte."],
    correct: 2,
    explanation: "Exact. Soutenir, conserver les preuves et signaler permet de briser le silence.",
  },
  {
    question: "Une IA te donne une information étonnante pour ton CV. Quel est le bon réflexe ?",
    options: ["Je la publie immédiatement.", "Je vérifie avec plusieurs sources fiables.", "Je demande à l'IA si elle est certaine."],
    correct: 1,
    explanation: "Parfait. Une réponse générée par une IA doit toujours être vérifiée.",
  },
];

function NavButton({ icon, label, active, onClick }: { icon: IconName; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}>
      <Icon name={icon} size={21} />
      <span>{label}</span>
    </button>
  );
}

function Illustration({ track }: { track: number }) {
  return (
    <div className={`hero-art art-${track}`} aria-hidden="true">
      <span className="orbit orbit-one">+</span>
      <span className="orbit orbit-two">✦</span>
      <span className="speech-bubble">{track === 0 ? "Je clique ?" : track === 1 ? "Un indice ?" : track === 2 ? "Je vérifie !" : "À moi de créer."}</span>
      <div className="character">
        <div className="hair" />
        <div className="face"><span /><span /><i /></div>
        <div className="shirt" />
        <div className="tablet"><Icon name={track > 1 ? "sparkle" : "shield"} size={30} /></div>
      </div>
    </div>
  );
}

export default function App() {
  const [track, setTrack] = useState(1);
  const [activeNav, setActiveNav] = useState("Accueil");
  const [quizOpen, setQuizOpen] = useState(false);
  const [answer, setAnswer] = useState<number | null>(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [missionAnswer, setMissionAnswer] = useState<number | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const copy = trackCopy[track];
  const modules = moduleSets[track];
  const quiz = quizData[track];

  const navigateTo = (label: string) => {
    setActiveNav(label);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleVoice = () => {
    if (voiceOn) {
      window.speechSynthesis?.cancel();
      setVoiceOn(false);
      return;
    }
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(`${copy.title}. ${copy.text}`);
      speech.lang = "fr-FR";
      speech.rate = track === 0 ? 0.82 : 0.95;
      speech.onend = () => setVoiceOn(false);
      window.speechSynthesis.speak(speech);
    }
    setVoiceOn(true);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <SosLogo />
        <nav className="desktop-nav" aria-label="Navigation principale">
          {[
            ["home", "Accueil"],
            ["book", "Mes parcours"],
            ["trophy", "Mes réussites"],
          ].map(([icon, label]) => (
            <NavButton key={label} icon={icon as IconName} label={label} active={activeNav === label} onClick={() => navigateTo(label)} />
          ))}
        </nav>
        <div className="header-actions">
          <div className="popover-anchor">
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}><Icon name="bell" /><i /></button>
            {notificationsOpen && (
              <div className="header-popover notifications-popover">
                <div className="popover-title"><b>Notifications</b><span>2 nouvelles</span></div>
                <div className="notification-item"><span><Icon name="award" size={18} /></span><p><b>Nouveau badge débloqué</b><small>Tu as obtenu « Gardien des secrets ».</small><time>Il y a 5 min</time></p></div>
                <div className="notification-item"><span><Icon name="flame" size={18} /></span><p><b>Série de 5 jours</b><small>Encore une activité pour continuer ta série.</small><time>Aujourd&apos;hui</time></p></div>
                <button className="popover-action">Tout marquer comme lu</button>
              </div>
            )}
          </div>
          <div className="popover-anchor">
          <button className="avatar-button" aria-label="Ouvrir mon profil" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}>
            <span className="avatar">AD</span>
            <span className="avatar-copy"><b>Adama</b><small>Explorateur</small></span>
            <span className="chevron">⌄</span>
          </button>
          {profileOpen && (
            <div className="header-popover profile-popover">
              <div className="profile-summary"><span className="avatar large">AD</span><p><b>Adama Diop</b><small>9–11 ans · Niveau 4</small></p></div>
              <button onClick={() => { navigateTo("Mes réussites"); setProfileOpen(false); }}><Icon name="profile" size={18} /> Mon profil</button>
              <button><Icon name="settings" size={18} /> Mes préférences</button>
              <button onClick={() => setHelpOpen(true)}><Icon name="headphones" size={18} /> Centre d&apos;aide</button>
            </div>
          )}
          </div>
        </div>
      </header>

      <main id="accueil">
        <section className={`age-strip ${activeNav === "Mes réussites" ? "view-hidden" : ""}`} aria-labelledby="age-heading">
          <div className="age-intro">
            <span className="eyebrow" id="age-heading">Mon espace</span>
            <strong>Choisis ton âge</strong>
          </div>
          <div className="track-picker">
            {ageTracks.map((item, index) => (
              <button key={item.age} className={`track-option ${item.color} ${track === index ? "selected" : ""}`} onClick={() => setTrack(index)} aria-pressed={track === index}>
                <span className="age-number">{item.age}<small>ans</small></span>
                <span className="track-label"><b>{item.name}</b><small>{item.description}</small></span>
                {track === index && <span className="selected-check"><Icon name="check" size={14} /></span>}
              </button>
            ))}
          </div>
        </section>

        {activeNav !== "Accueil" && (
          <section className="page-heading">
            <div>
              <span className="eyebrow">{activeNav === "Mes parcours" ? "Bibliothèque d'apprentissage" : "Mon espace personnel"}</span>
              <h1>{activeNav}</h1>
              <p>{activeNav === "Mes parcours" ? "Des parcours progressifs, conçus pour ton âge et ton quotidien au Sénégal." : "Découvre tout ce que tu as appris et les prochains défis qui t'attendent."}</p>
            </div>
            <span className="page-heading-mark"><Icon name={activeNav === "Mes parcours" ? "book" : "trophy"} size={34} /></span>
          </section>
        )}

        <section className={`hero track-${track} ${activeNav !== "Accueil" ? "view-hidden" : ""}`}>
          <div className="hero-copy">
            <div className="hero-badge"><Icon name="sparkle" size={16} /> Parcours {ageTracks[track].age} ans</div>
            <p className="hero-eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
            <p className="hero-text">{copy.text}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => setQuizOpen(true)}>
                <span className="button-play"><Icon name="play" size={17} /></span>
                {copy.cta}
              </button>
              <div className="hero-progress">
                <span><b>{track === 0 ? 1 : track + 2}</b> activités terminées</span>
                <div className="mini-progress"><i style={{ width: `${25 + track * 12}%` }} /></div>
              </div>
            </div>
            <button className={`listen-button ${voiceOn ? "speaking" : ""}`} onClick={toggleVoice}>
              <Icon name="volume" size={17} />
              {voiceOn ? "Lecture en cours…" : "Écouter cette page"}
              {voiceOn && <span className="sound-wave"><i /><i /><i /><i /></span>}
            </button>
          </div>
          <Illustration track={track} />
          <div className="wave" />
        </section>

        <section className={`impact-strip ${activeNav !== "Accueil" ? "view-hidden" : ""}`} aria-label="Résumé de ta progression">
          <div><span className="impact-icon blue"><Icon name="star" /></span><p><b>1 240</b><small>points gagnés</small></p></div>
          <div><span className="impact-icon coral"><Icon name="flame" /></span><p><b>5 jours</b><small>de suite</small></p></div>
          <div><span className="impact-icon green"><Icon name="shield" /></span><p><b>Niveau 4</b><small>Cyber-gardien</small></p></div>
          <div className="next-goal"><span>Prochain badge</span><b>Détective du web</b><div><i /></div><small>Encore 160 points</small></div>
        </section>

        <section className={`content-section ${activeNav === "Mes réussites" ? "view-hidden" : ""}`} id="parcours">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{activeNav === "Mes parcours" ? `${ageTracks[track].age} ans · ${ageTracks[track].name}` : "Apprendre à ton rythme"}</span>
              <h2>{activeNav === "Mes parcours" ? "Tous les modules de ton niveau" : "Continue ton parcours"}</h2>
            </div>
            {activeNav === "Accueil" && <button className="text-button" onClick={() => navigateTo("Mes parcours")}>Voir tout <Icon name="arrow" size={18} /></button>}
          </div>

          <div className="module-grid">
            {modules.map((module, index) => (
              <article className={`module-card ${module.color}`} key={module.title}>
                <div className="module-visual">
                  <span className="module-number">0{index + 1}</span>
                  <span className="module-icon">{module.icon}</span>
                  {module.progress === 100 && <span className="complete-pill"><Icon name="check" size={13} /> Terminé</span>}
                </div>
                <div className="module-body">
                  <div className="module-meta">
                    <span>{module.kicker}</span>
                    <span><Icon name="clock" size={15} /> {module.duration}</span>
                  </div>
                  <h3>{module.title}</h3>
                  <div className="card-bottom">
                    {module.progress > 0 && module.progress < 100 ? (
                      <div className="card-progress"><span><i style={{ width: `${module.progress}%` }} /></span><small>{module.progress}%</small></div>
                    ) : <span className="available">{module.progress === 100 ? "À revoir quand tu veux" : "Prêt à commencer"}</span>}
                    <button className="round-button" aria-label={`Ouvrir ${module.title}`} onClick={() => { setAnswer(null); setQuizOpen(true); }}><Icon name={index === 2 && track > 0 ? "lock" : "arrow"} size={18} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`digital-lab ${activeNav !== "Accueil" ? "view-hidden" : ""}`}>
          <div className="lab-heading">
            <span className="eyebrow">Apprendre en faisant</span>
            <h2>Le laboratoire numérique</h2>
            <p>Des situations inspirées de la vraie vie pour entraîner tes réflexes, sans aucun risque.</p>
          </div>
          <div className="lab-grid">
            <article className="mission-card">
              <div className="mission-top">
                <span className="live-pill"><i /> Mission du jour</span>
                <span className="points-pill">+ 80 points</span>
              </div>
              <div className="fake-phone">
                <div className="fake-profile"><span>KM</span><p><b>Khadim_221</b><small>Nouveau message</small></p></div>
                <div className="chat-bubble">Salut ! J&apos;organise un concours. Envoie-moi le code reçu par SMS et tu gagneras un téléphone.</div>
              </div>
              <h3>Que repères-tu dans ce message ?</h3>
              <div className="mission-options">
                {["Une super occasion", "Une tentative d'arnaque"].map((option, index) => (
                  <button
                    key={option}
                    className={missionAnswer === index ? (index === 1 ? "good" : "bad") : ""}
                    onClick={() => setMissionAnswer(index)}
                  >
                    <span>{index === 0 ? "🎁" : "🚨"}</span>{option}
                  </button>
                ))}
              </div>
              {missionAnswer !== null && <p className={`mission-feedback ${missionAnswer === 1 ? "good" : "bad"}`}>{missionAnswer === 1 ? "Bien vu ! Un code reçu par SMS ne doit jamais être partagé." : "Attention : la promesse d'un cadeau sert ici à te mettre en confiance."}</p>}
            </article>

            <article className="world-card">
              <div className="world-visual">
                <div className="world-orbit orbit-a"><span>DAKAR</span></div>
                <div className="world-orbit orbit-b"><span>LOUGA</span></div>
                <div className="globe-core"><Icon name="globe" size={52} /><b>2 438</b><small>jeunes connectés</small></div>
              </div>
              <div className="world-copy">
                <span className="eyebrow">La communauté BeDiCi</span>
                <h3>On apprend mieux ensemble</h3>
                <p>Partage tes bonnes pratiques avec les jeunes des villages SOS partout au Sénégal.</p>
                <div className="community-faces"><span>AM</span><span>FD</span><span>IB</span><span>+99</span><small>actifs aujourd&apos;hui</small></div>
              </div>
            </article>
          </div>
        </section>

        {activeNav === "Mes réussites" && (
          <section className="achievement-overview">
            <div className="level-card">
              <div className="level-ring"><span><b>4</b><small>Niveau</small></span></div>
              <div><span className="eyebrow">Mon niveau actuel</span><h2>Cyber-gardien</h2><p>Tu sais déjà reconnaître les principaux risques et protéger tes informations.</p></div>
            </div>
            <div className="badge-shelf">
              {[
                ["🛡️", "Gardien des secrets", "Obtenu"],
                ["🔎", "Détective du web", "72%"],
                ["🤝", "Allié bienveillant", "Obtenu"],
                ["🤖", "Explorateur IA", "À découvrir"],
              ].map(([symbol, title, status], index) => (
                <div className={`badge-item ${status === "Obtenu" ? "earned" : ""}`} key={title}>
                  <span className={`badge-medal badge-${index}`}>{symbol}</span>
                  <b>{title}</b><small>{status}</small>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={`passport-section ${activeNav !== "Mes réussites" ? "view-hidden" : ""}`} id="passeport">
          <div className="passport-intro">
            <span className="passport-symbol"><Icon name="award" size={32} /></span>
            <span className="eyebrow">Mon passeport numérique</span>
            <h2>Des compétences pour toute la vie</h2>
            <p>Ton passeport grandit avec toi. Chaque activité validée prouve une nouvelle compétence que tu peux réutiliser à l&apos;école, à la maison et plus tard dans ton métier.</p>
            <button className="outline-button">Voir mon passeport <Icon name="arrow" size={18} /></button>
          </div>
          <div className="skills-panel">
            {[
              ["Me protéger", 82, "shield", "blue"],
              ["Comprendre l'information", 64, "book", "yellow"],
              ["Respecter les autres", 76, "profile", "coral"],
              ["Créer et collaborer", 48, "sparkle", "violet"],
            ].map(([label, value, icon, color]) => (
              <div className="skill-row" key={label as string}>
                <span className={`skill-icon ${color}`}><Icon name={icon as IconName} size={19} /></span>
                <div><p><b>{label}</b><span>{value}%</span></p><div className={`skill-progress ${color}`}><i style={{ width: `${value}%` }} /></div></div>
              </div>
            ))}
            <div className="certificate-note"><Icon name="award" size={20} /><p><b>Prochain objectif</b><span>Complète 2 modules pour obtenir le badge « Esprit critique ».</span></p></div>
          </div>
        </section>

        <section className="safety-banner">
          <div className="safety-icon"><Icon name="headphones" size={30} /></div>
          <div>
            <span className="eyebrow">Tu n'es jamais seul·e</span>
            <h2>Quelque chose en ligne te met mal à l'aise ?</h2>
            <p>Parle-en à un adulte de confiance de ton village. Il est là pour t'écouter, sans te juger.</p>
          </div>
          <button className="outline-button" onClick={() => setHelpOpen(true)}>J&apos;ai besoin d&apos;aide <Icon name="arrow" size={18} /></button>
        </section>
      </main>

      <footer>
        <SosLogo />
        <p>Grandir avec le numérique, en confiance.</p>
        <span>© 2025 SOS Villages d&apos;Enfants Sénégal</span>
      </footer>

      {quizOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="quiz-modal" role="dialog" aria-modal="true" aria-labelledby="quiz-title">
            <button className="modal-close" onClick={() => setQuizOpen(false)} aria-label="Fermer"><Icon name="close" /></button>
            <div className="quiz-icon"><Icon name="shield" size={28} /></div>
            <span className="eyebrow">Défi express · 1 sur 3</span>
            <h2 id="quiz-title">{quiz.question}</h2>
            <div className="quiz-options">
              {quiz.options.map((option, index) => (
                <button key={option} className={`quiz-option ${answer === index ? (index === quiz.correct ? "correct" : "wrong") : ""}`} onClick={() => setAnswer(index)}>
                  <span>{String.fromCharCode(65 + index)}</span>{option}
                </button>
              ))}
            </div>
            {answer !== null && (
              <div className={`feedback ${answer === quiz.correct ? "success" : "retry"}`}>
                <Icon name={answer === quiz.correct ? "check" : "shield"} />
                <p><b>{answer === quiz.correct ? "Excellent réflexe !" : "Pas tout à fait."}</b>{answer === quiz.correct ? ` ${quiz.explanation}` : " Observe bien la situation et essaie encore."}</p>
              </div>
            )}
          </section>
        </div>
      )}

      {helpOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
            <button className="modal-close" onClick={() => setHelpOpen(false)} aria-label="Fermer"><Icon name="close" /></button>
            <div className="help-illustration"><Icon name="headphones" size={34} /></div>
            <span className="eyebrow">Tu as bien fait de venir</span>
            <h2 id="help-title">Tu n&apos;as pas à gérer ça seul·e.</h2>
            <p>Choisis une personne de confiance de ton village SOS. Elle pourra t&apos;écouter et agir avec toi, sans te juger.</p>
            <div className="help-actions">
              <button><span><Icon name="profile" /></span><p><b>Parler à mon éducateur·rice</b><small>Disponible dans ton village</small></p><Icon name="arrow" size={18} /></button>
              <button><span><Icon name="book" /></span><p><b>Conserver une preuve</b><small>Apprendre à faire une capture</small></p><Icon name="arrow" size={18} /></button>
            </div>
            <small className="privacy-note"><Icon name="shield" size={15} /> Cet espace est confidentiel et sécurisé.</small>
          </section>
        </div>
      )}
    </div>
  );
}
