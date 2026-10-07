"use client";

import Link from "next/link";
import SosLogo from "../components/sos-logo";
import ThemeToggle from "../components/theme-toggle";
import { FormEvent, useState } from "react";
import { createClient } from "../../src/lib/supabase/client";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const supabase = createClient();
    if (!supabase) { setMessage("La connexion sécurisée n’est pas encore configurée."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    setMessage(error ? "Le lien est invalide ou expiré. Demande un nouveau lien." : "Ton mot de passe a été modifié. Tu peux te connecter.");
  }
  return <main className="auth-page"><ThemeToggle className="auth-theme-toggle" /><Link className="auth-back" href="/">← Retour à l’accueil</Link><section className="auth-card"><div className="auth-brand"><SosLogo /></div><div className="auth-eyebrow">DERNIÈRE ÉTAPE</div><h1>Un nouveau<br /><span>départ.</span></h1><p className="auth-intro">Choisis un nouveau mot de passe pour retrouver ton espace.</p><form className="auth-form" onSubmit={submit}><label>Nouveau mot de passe<input type="password" name="password" autoComplete="new-password" minLength={8} placeholder="8 caractères minimum" required /></label>{message && <div className="auth-message" role="status">{message}</div>}<button className="auth-submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer le mot de passe"}<span>→</span></button></form><div className="auth-switch"><Link href="/connexion">Aller à la connexion</Link></div><div className="auth-safe"><span>✓</span> Tes informations restent protégées.</div></section><aside className="auth-side"><div className="auth-side-shape"><span>✦</span></div><p>Chaque aventure peut reprendre. On t’aide à retrouver ton chemin.</p><span className="auth-side-caption">APPRENDRE · COMPRENDRE · AGIR</span></aside></main>;
}
