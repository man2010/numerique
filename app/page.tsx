import Link from "next/link";
import SosLogo from "./components/sos-logo";
import HomePlayground from "./components/home-playground";
import ThemeToggle from "./components/theme-toggle";

const paths = [
  { age: "6–8 ans", title: "Je découvre", text: "Les premiers clics, les écrans et les adultes de confiance.", tone: "peach", icon: "✳" },
  { age: "9–11 ans", title: "Je comprends", text: "Les secrets, les bons réflexes et les rencontres en ligne.", tone: "lemon", icon: "⌁" },
  { age: "12–15 ans", title: "J’analyse", text: "L’info, le respect en ligne et les situations qui questionnent.", tone: "lilac", icon: "◈" },
  { age: "16–18 ans", title: "Je construis", text: "Mon identité numérique, l’IA et mes projets pour demain.", tone: "mint", icon: "↗" },
];

export default function HomePage() {
  return (
    <main className="landing">
      <header className="landing-header">
        <SosLogo />
        <nav className="landing-nav" aria-label="Navigation principale"><a href="#parcours">Les parcours</a><a href="#decouvertes">Les découvertes</a><a href="#accompagnement">Notre approche</a></nav>
        <div className="landing-actions"><ThemeToggle /><Link className="landing-login" href="/connexion">Se connecter</Link><Link className="landing-signup" href="/inscription">Créer un compte <span>↗</span></Link></div>
      </header>
      <section className="landing-hero">
        <div className="hero-copy"><div className="hero-kicker"><span className="kicker-dot" /> UN ESPACE POUR GRANDIR EN LIGNE</div><h1>Le numérique<br />s’apprend.<br /><span>Ensemble.</span></h1><p className="hero-description">Des repères simples, des défis concrets et des adultes à tes côtés pour vivre Internet avec confiance.</p><div className="hero-cta-row"><Link href="/inscription" className="hero-cta">Je commence l’aventure <span>→</span></Link><span className="hero-note">Gratuit · À ton rythme · Dès 6 ans</span></div><div className="hero-trust"><div className="trust-faces"><span>A</span><span>M</span><span>F</span><span>+</span></div><p><b>Un chemin qui se fait ensemble</b><br />Jeunes, éducateurs et familles avancent côte à côte.</p></div></div>
        <div className="hero-visual" role="img" aria-label="Une jeune explore un parcours numérique sécurisé"><div className="visual-sun" /><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><span className="float-star star-one">✳</span><span className="float-star star-two">✦</span><div className="visual-sticker sticker-top"><span>✦</span> À toi de jouer !</div><div className="hero-person"><div className="person-hair" /><div className="person-face"><i /><i /><b /></div><div className="person-neck" /><div className="person-shirt"><span>n+</span></div><div className="person-device"><span>✦</span><i /><i /><i /></div></div><div className="visual-sticker sticker-bottom"><span className="sticker-shield">✓</span><div><b>Tu avances à ton rythme</b><small>Chaque petit pas compte.</small></div></div><div className="visual-caption">APPRENDRE · COMPRENDRE · AGIR</div></div>
        <div className="hero-bottomline"><span>UNE INITIATIVE SOS VILLAGES D’ENFANTS SÉNÉGAL</span><span>POUR UN NUMÉRIQUE PLUS SÛR ET PLUS HUMAIN <i>↓</i></span></div>
      </section>
      <section className="paths-section" id="parcours"><div className="section-eyebrow">TON ÂGE, TON PARCOURS</div><div className="paths-heading"><h2>À chaque étape,<br /><span>les bons repères.</span></h2><p>Des activités courtes et adaptées à ton âge. Tu explores, tu essaies, tu comprends — sans pression.</p></div><div className="path-grid">{paths.map((path, index) => <article className={`path-card ${path.tone}`} key={path.age}><div className="path-top"><span>{path.age}</span><span className="path-index">0{index + 1}</span></div><div className="path-icon">{path.icon}</div><h3>{path.title}</h3><p>{path.text}</p><Link href="/inscription" aria-label={`Commencer le parcours ${path.age}`}>Découvrir <span>↗</span></Link></article>)}</div></section>
      <HomePlayground />
      <section className="support-section" id="accompagnement"><div className="support-mark">“</div><div><div className="section-eyebrow">ON NE GRANDIT PAS SEUL</div><h2>Le meilleur réflexe ?<br /><span>En parler.</span></h2><p>Une question, une situation qui te gêne ? Ton espace t’aide à trouver les mots et à te tourner vers un adulte de confiance.</p><Link href="/inscription" className="support-link">Découvrir l’accompagnement <span>→</span></Link></div><div className="support-aside"><div className="support-icon">♡</div><b>Un espace qui prend soin de toi.</b><span>À chaque étape, des repères pensés pour apprendre dans un cadre bienveillant.</span></div></section>
      <section className="team-section"><div><div className="section-eyebrow">UNE AVENTURE À PLUSIEURS</div><h2>Chacun a sa place<br />dans l’aventure.</h2></div><div className="team-grid"><Link href="/inscription?role=learner"><span>01 / JEUNE</span><b>J’explore et j’apprends <i>↗</i></b></Link><Link href="/inscription?role=educator"><span>02 / ÉDUCATEUR·RICE</span><b>J’accompagne les jeunes <i>↗</i></b></Link><Link href="/connexion?role=admin"><span>03 / ADMINISTRATION</span><b>Je pilote la plateforme <i>↗</i></b></Link></div></section>
      <footer className="landing-footer"><SosLogo /><p>Grandir avec le numérique, en confiance.</p><span>© 2026 SOS Villages d’Enfants Sénégal</span></footer>
    </main>
  );
}
