import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function RegisterPage() { return <div className="shell form-page"><div className="form-panel" style={{ maxWidth: 480, margin: "0 auto" }}><p className="eyebrow">Join Averoza</p><h1>Create account.</h1><AuthForm mode="register" /><p>Already have an account? <Link href="/login" className="section-link">Sign in</Link></p></div></div>; }
