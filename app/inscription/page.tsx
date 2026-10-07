import type { Metadata } from "next";
import AuthForm from "../auth/auth-form";

export const metadata: Metadata = { title: "Créer un compte | Numérique en confiance" };
export default function SignupPage() { return <AuthForm mode="signup" />; }
