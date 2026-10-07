import type { Metadata } from "next";
import AuthForm from "../auth/auth-form";

export const metadata: Metadata = { title: "Connexion | Numérique en confiance" };
export default function LoginPage() { return <AuthForm mode="login" />; }
