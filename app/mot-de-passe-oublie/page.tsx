"use client";

import Link from "next/link";
import SosLogo from "../components/sos-logo";
import ThemeToggle from "../components/theme-toggle";
import { FormEvent, useState } from "react";
import { createClient } from "../../src/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const email = String(new FormData(event.currentTarget).get("email") || "").trim();
    const supabase = createClient();
    if (!supabase) { setMessage("La connexion sécurisée n’est pas encore configurée. Réessaie après la configuration Supabase."); return; }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe` });
    setBusy(false);
    setMessage(error ? "Impossible d’envoyer le lien pour le moment. Vérifie l’adresse puis réessaie." : "Si un compte correspond à cette adresse, tu recevras un lien pour choisir un nouveau mot de passe.");
  }
  return <main className="auth-page"><ThemeToggle className="auth-theme-toggle" /><Link className="auth-back" href="/connexion">← Retour à la connexion</Link><section className="auth-card"><div className="auth-brand"><SosLogo /></div><div className="auth-eyebrow">ON VA TROUVER UNE SOLUTION</div><h1>Un petit<br /><span>oubli ?</span></h1><p className="auth-intro">Indique l’adresse utilisée lors de ton inscription. Nous t’enverrons un lien de réinitialisation.</p><form className="auth-form" onSubmit={submit}><label>Adresse e-mail<input type="email" name="email" autoComplete="email" placeholder="toi@exemple.com" required /></label>{message && <div className="auth-message" role="status">{message}</div>}<button className="auth-submit" disabled={busy}>{busy ? "Envoi…" : "Recevoir mon lien"}<span>→</span></button></form><div className="auth-switch"><Link href="/connexion">Retourner à la connexion</Link></div><div className="auth-safe"><span>✓</span> Tes informations restent protégées.</div></section><aside className="auth-side"><div className="auth-side-shape"><span>✦</span></div><p>Chaque aventure peut reprendre. On t’aide à retrouver ton chemin.</p><span className="auth-side-caption">APPRENDRE · COMPRENDRE · AGIR</span></aside></main>;
}
