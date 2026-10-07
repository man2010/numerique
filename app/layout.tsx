import type { Metadata } from "next";
import "../src/index.css";
import PwaControls, { PwaRuntime } from "./components/pwa-controls";
import { ThemeRuntime } from "./components/theme-toggle";

export const metadata: Metadata = {
  title: "Mon aventure numérique | SOS Villages d’Enfants Sénégal",
  description: "Apprendre à grandir et à se protéger dans le monde numérique.",
  applicationName: "Mon aventure numérique",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Mon aventure" },
  icons: { apple: "/icons/icon-192.png" },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><ThemeRuntime /><PwaRuntime />{children}<PwaControls /></body></html>;
}
