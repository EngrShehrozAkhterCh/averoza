import Link from "next/link";
export default function AccountPage() { return <div className="shell form-page"><div className="page-intro"><p className="eyebrow">Your space</p><h1>Account.</h1><p>Sign in to view your profile and order history.</p><Link className="button" href="/login">Sign in</Link></div></div>; }
