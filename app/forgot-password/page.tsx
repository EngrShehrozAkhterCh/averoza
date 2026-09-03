import { AuthForm } from "@/components/auth-form";
export default function ForgotPasswordPage() { return <div className="shell form-page"><div className="form-panel" style={{ maxWidth: 480, margin: "0 auto" }}><p className="eyebrow">Account access</p><h1>Reset password.</h1><p>Enter your email and Supabase will send a secure reset link.</p><AuthForm mode="forgot" /></div></div>; }
