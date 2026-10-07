"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { createClient } from "../../src/lib/supabase/client";
import SosLogo from "../components/sos-logo";
import ThemeToggle from "../components/theme-toggle";

type Role = "learner" | "educator";

function AuthFormContent({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const initialRole = params.get("role") === "educator" ? "educator" : "learner";
  const [role, setRole] = useState<Role>(initialRole);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const signup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const client = createClient();
    if (!client) {
      setMessage("La connexion sécurisée n’est pas encore configurée. Ajoute les clés de ton projet Supabase dans les variables d’environnement puis réessaie.");
      return;
    }
    setBusy(true);
    try {
      if (signup) {
        const name = String(form.get("name") || "").trim();
        const ageBand = String(form.get("ageBand") || "");
        if (role === "learner" && !ageBand) {
          setMessage("Choisis ta tranche d’âge pour recevoir des activités adaptées.");
          return;
        }
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: { data: { display_name: name, role, age_band: role === "learner" ? ageBand : null } },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage("Ton compte est presque prêt. Consulte ta boîte mail pour confirmer ton adresse avant de te connecter.");
          return;
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data: { user } } = await client.auth.getUser();
      const { data: profile } = user ? await client.from("profiles").select("role").eq("id", user.id).maybeSingle() : { data: null };
      const destination = profile?.role === "admin" ? "/administration" : profile?.role === "educator" ? "/educateur" : "/espace-jeune";
      router.replace(destination);
      router.refresh();
    } catch (error) {
      const text = error instanceof Error ? error.message : "Une erreur est survenue. Réessaie dans un instant.";
      setMessage(text.includes("Invalid login credentials") ? "Adresse e-mail ou mot de passe incorrect." : text.includes("User already registered") ? "Cette adresse e-mail possède déjà un compte. Connecte-toi plutôt." : text);
    } finally {
      setBusy(false);
    }
  }

  const accountRole = params.get("role");
  const allowRoleSelect = signup && accountRole !== "admin";
  return <main className="auth-page"><ThemeToggle className="auth-theme-toggle" /><Link className="auth-back" href="/">← Retour à l’accueil</Link><section className="auth-card"><div className="auth-brand"><SosLogo/></div><div className="auth-eyebrow">{signup ? "TON AVENTURE COMMENCE ICI" : "HEUREUX DE TE RETROUVER"}</div><h1>{signup ? <>Créer mon<br /><span>espace.</span></> : <>Content de te<br /><span>revoir.</span></>}</h1><p className="auth-intro">{signup ? "Un compte pour apprendre à ton rythme et retrouver tes progrès." : "Retrouve tes parcours et continue là où tu en étais."}</p>
    {allowRoleSelect && <div className="role-selector" aria-label="Type de compte"><button type="button" className={role === "learner" ? "selected" : ""} onClick={() => setRole("learner")}><span>✦</span><b>Jeune</b><small>Je découvre et j’apprends</small></button><button type="button" className={role === "educator" ? "selected" : ""} onClick={() => setRole("educator")}><span>♡</span><b>Éducateur·rice</b><small>J’accompagne les jeunes</small></button></div>}
    <form className="auth-form" onSubmit={handleSubmit}>
      {signup && <label>Prénom ou nom d’affichage<input name="name" autoComplete="name" placeholder="Comment t’appelle-t-on ?" minLength={2} maxLength={60} required /></label>}
      <label>Adresse e-mail<input type="email" name="email" autoComplete="email" placeholder="toi@exemple.com" maxLength={254} required /></label>
      {signup && role === "learner" && <label>Ta tranche d’âge<select name="ageBand" defaultValue="" required><option value="" disabled>Choisis ton parcours</option><option value="6-8">6 à 8 ans</option><option value="9-11">9 à 11 ans</option><option value="12-15">12 à 15 ans</option><option value="16-18">16 à 18 ans</option></select><small className="field-note">Nous n’avons pas besoin de ta date de naissance.</small></label>}
      <label>Mot de passe<span className="password-field"><input type={showPassword ? "text" : "password"} name="password" autoComplete={signup ? "new-password" : "current-password"} placeholder={signup ? "8 caractères minimum" : "Ton mot de passe"} minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? "Masquer" : "Voir"}</button></span></label>
      {!signup && <Link className="forgot-link" href="/mot-de-passe-oublie">Mot de passe oublié ?</Link>}
      {message && <div className="auth-message" role="alert">{message}</div>}
      <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Un instant…" : signup ? "Créer mon compte" : "Me connecter"}<span>→</span></button>
      {signup && <p className="consent-note">En continuant, tu acceptes nos conditions d’utilisation et notre politique de confidentialité.</p>}
    </form><div className="auth-switch">{signup ? "Tu as déjà un compte ?" : "Pas encore de compte ?"} <Link href={signup ? "/connexion" : "/inscription"}>{signup ? "Me connecter" : "Créer un compte"}</Link></div><div className="auth-safe"><span>✓</span> Tes informations restent protégées.</div>
    </section><aside className="auth-side"><div className="auth-side-shape"><span>✦</span></div><p>« Le numérique, c’est une aventure. On la construit ensemble, un bon réflexe à la fois. »</p><span className="auth-side-caption">APPRENDRE · COMPRENDRE · AGIR</span></aside></main>;
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  return <Suspense fallback={<main className="auth-loading">Préparation de ton espace…</main>}><AuthFormContent mode={mode} /></Suspense>;
}
