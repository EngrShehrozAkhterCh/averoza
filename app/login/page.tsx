import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() { return <div className="shell form-page"><div className="form-panel" style={{ maxWidth: 480, margin: "0 auto" }}><p className="eyebrow">Welcome back</p><h1>Sign in.</h1><AuthForm mode="login" /><p><Link href="/forgot-password" className="section-link">Forgot password?</Link></p><p>New here? <Link href="/register" className="section-link">Create an account</Link></p></div></div>; }
