"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingMobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return <div className="landing-mobile-menu">
    <button className="landing-menu-trigger" type="button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="landing-mobile-panel" onClick={() => setOpen((value) => !value)}>
      {open ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>}
    </button>
    <nav className="landing-mobile-panel" id="landing-mobile-panel" data-open={open} aria-label="Navigation principale">
      <span>EXPLORER</span>
      <a href="#parcours" onClick={close}>Les parcours <i>↗</i></a>
      <a href="#decouvertes" onClick={close}>Les découvertes <i>↗</i></a>
      <a href="#accompagnement" onClick={close}>Notre approche <i>↗</i></a>
      <Link href="/connexion" onClick={close}>Se connecter <i>↗</i></Link>
      <Link className="landing-mobile-create" href="/inscription" onClick={close}>Créer un compte <i>↗</i></Link>
    </nav>
  </div>;
}
