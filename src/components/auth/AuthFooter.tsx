import Link from "next/link";
export function AuthFooter({ prompt, action, href }: { prompt: string; action: string; href: string }) { return <p className="mt-6 text-center text-sm text-slate-600">{prompt} <Link className="font-bold text-sky-700 underline-offset-4 hover:text-sky-500 hover:underline" href={href}>{action}</Link></p>; }
