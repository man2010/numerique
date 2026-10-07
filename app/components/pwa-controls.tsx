"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function PwaRuntime() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    }
  }, []);
  return null;
}

export default function PwaControls() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [iosInstall, setIosInstall] = useState(false);
  const [offline, setOffline] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    setIosInstall(/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
    setInstalled(isStandalone);
    setOffline(!navigator.onLine);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  async function install() {
    if (!installPrompt) {
      setShowIosHelp(true);
      return;
    }
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  return <>
    {offline && <div className="connection-banner" role="status"><span /> Mode hors ligne · Les leçons déjà chargées restent accessibles.</div>}
    {!installed && (installPrompt || iosInstall) && <button className="pwa-install" type="button" onClick={install} aria-label="Installer l’application sur cet appareil"><span aria-hidden="true">↓</span><b>Installer l’app</b></button>}
    {showIosHelp && <div className="pwa-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowIosHelp(false); }}><section className="pwa-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-title"><button className="pwa-dialog-close" type="button" onClick={() => setShowIosHelp(false)} aria-label="Fermer">×</button><span className="pwa-dialog-icon">↗</span><p className="section-eyebrow">GARDER TON ESPACE À PORTÉE DE MAIN</p><h2 id="pwa-title">Ajoute l’app à ton écran d’accueil.</h2><p>Dans Safari, touche <b>Partager</b>, puis choisis <b>Sur l’écran d’accueil</b>. L’icône apparaîtra à côté de tes autres applications.</p><button className="auth-submit" type="button" onClick={() => setShowIosHelp(false)}>J’ai compris <span>✓</span></button></section></div>}
  </>;
}
