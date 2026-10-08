"use client";

import { useState } from "react";

type Item = { label: string; href: string };

export default function WorkspaceMobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  return <div className="workspace-mobile-menu">
    <button className="mobile-menu-trigger" type="button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="workspace-mobile-panel" onClick={() => setOpen((value) => !value)}>
      {open ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>}
    </button>
    <div className="mobile-menu-panel" id="workspace-mobile-panel" data-open={open}>
      <span className="mobile-menu-eyebrow">NAVIGATION</span>
      {items.map((item) => <a href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}<span aria-hidden="true">↗</span></a>)}
      <form action="/auth/signout" method="post"><button type="submit"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3m9-8h6a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-6"/></svg>Se déconnecter</button></form>
    </div>
  </div>;
}
