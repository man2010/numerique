"use client";

import Link from "next/link";
import { useState } from "react";

const topics = [
  { id: "confidentialite", icon: "🛡️", title: "Mes infos, mes choix", line: "Vie privée et données personnelles", color: "aqua", question: "Un jeu te demande d’indiquer ton adresse. Tu fais quoi ?", answers: ["Je demande conseil avant de répondre.", "Je la donne pour continuer."], correct: 0, why: "Bonne idée ! Une adresse reste privée. Un adulte de confiance peut t’aider à vérifier." },
  { id: "respect", icon: "💛", title: "Le respect en ligne", line: "Amitié, émotions et cyberharcèlement", color: "sun", question: "Une personne est moquée dans une discussion. Quel réflexe aide le plus ?", answers: ["Je transfère les messages.", "Je la soutiens et j’en parle à un adulte."], correct: 1, why: "Soutenir sans repartager et demander de l’aide, c’est déjà agir." },
  { id: "info", icon: "🔎", title: "Info ou intox ?", line: "Images, rumeurs et esprit critique", color: "lilac", question: "Une info urgente circule sans source. Tu la partages ?", answers: ["Je vérifie la date et l’origine.", "Je la partage au cas où."], correct: 0, why: "Vérifier la source et la date aide à ne pas propager une fausse information." },
  { id: "ia", icon: "✨", title: "L’IA en confiance", line: "Créer, vérifier et garder le contrôle", color: "mint", question: "Une IA te donne une statistique étonnante. Tu fais quoi ?", answers: ["Je vérifie dans une source fiable.", "Je la crois si la réponse est convaincante."], correct: 0, why: "Une IA peut se tromper. Vérifier garde ton esprit aux commandes." },
];

const steps = [
  { icon: "🧭", title: "Je découvre", text: "Une situation concrète, proche de ce que tu peux vivre." },
  { icon: "🎯", title: "Je m’entraîne", text: "Un défi interactif pour essayer un bon réflexe." },
  { icon: "🌟", title: "Je progresse", text: "Tes réussites font avancer ton parcours et tes repères." },
];

export default function HomePlayground() {
  const [topicIndex, setTopicIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const topic = topics[topicIndex];

  function chooseTopic(index: number) {
    setTopicIndex(index);
    setAnswer(null);
  }

  return <>
    <section className="discovery-section" id="decouvertes">
      <div className="discovery-heading"><div><span className="section-eyebrow">À EXPLORER ENSEMBLE</span><h2>Le numérique, ça se vit.<br /><span>Et ça s’apprend en jouant.</span></h2></div><p>Choisis un sujet et essaie une mini-mission. Dans ton espace, chaque thème devient un parcours adapté à ton âge.</p></div>
      <div className="discovery-layout">
        <div className="topic-list" role="tablist" aria-label="Choisir un thème">
          {topics.map((item, index) => <button key={item.id} className={`topic-choice ${item.color} ${topicIndex === index ? "active" : ""}`} role="tab" aria-selected={topicIndex === index} aria-controls="topic-preview" onClick={() => chooseTopic(index)}><span className="topic-icon">{item.icon}</span><span className="topic-label"><b>{item.title}</b><small>{item.line}</small></span><span className="topic-arrow" aria-hidden="true">↗</span></button>)}
        </div>
        <article className={`mission-preview ${topic.color}`} id="topic-preview" role="tabpanel" key={topic.id}>
          <div className="preview-top"><span className="preview-pill"><i /> MINI-MISSION</span><span className="preview-counter">0{topicIndex + 1} / 04</span></div>
          <span className="preview-orbit" aria-hidden="true">{topic.icon}</span>
          <div className="preview-copy"><span className="preview-overline">À TOI DE JOUER</span><h3>{topic.question}</h3><div className="preview-answers">{topic.answers.map((option, index) => <button key={option} className={answer === index ? answer === topic.correct ? "answer-correct" : "answer-try" : ""} onClick={() => setAnswer(index)} aria-pressed={answer === index}><i>{String.fromCharCode(65 + index)}</i>{option}</button>)}</div>{answer !== null && <p className={`preview-feedback ${answer === topic.correct ? "correct" : "try"}`} role="status"><b>{answer === topic.correct ? "Bien joué !" : "Encore un essai !"}</b> {answer === topic.correct ? topic.why : "Choisis le réflexe qui te protège le mieux."}</p>}</div>
          <Link className="preview-continue" href="/inscription?role=learner">Continuer mon aventure <span>→</span></Link>
        </article>
      </div>
    </section>
    <section className="steps-section" aria-labelledby="steps-title"><div className="steps-intro"><span className="section-eyebrow">UN PARCOURS QUI TE RESSEMBLE</span><h2 id="steps-title">Trois petits pas.<br /><span>De grandes idées.</span></h2><p>Tu avances à ton rythme, seul·e ou avec un adulte de confiance.</p><Link href="/inscription" className="steps-link">Découvrir mon espace <span>↗</span></Link></div><div className="steps-track">{steps.map((step, index) => <article className="step-card" key={step.title}><span className="step-number">0{index + 1}</span><span className="step-emoji">{step.icon}</span><h3>{step.title}</h3><p>{step.text}</p>{index < steps.length - 1 && <span className="step-connector" aria-hidden="true">→</span>}</article>)}</div></section>
    <section className="resource-band"><div className="resource-illustration" aria-hidden="true"><span>📚</span><i>✦</i></div><div><span className="section-eyebrow">UNE BIBLIOTHÈQUE POUR GRANDIR</span><h2>Des quiz, des repères<br />et des mots pour comprendre.</h2><p>Vie privée, droits de l’enfant, réseaux sociaux, signalement, IA… retrouve les thèmes essentiels dans des activités adaptées à ton âge.</p></div><Link href="/inscription?role=learner">Explorer les thèmes <span>↗</span></Link></section>
  </>;
}
