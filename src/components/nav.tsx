import Link from "next/link";
import { getDictionary, getLocale } from "@/lib/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";

export async function Nav() {
  const t = await getDictionary();
  const locale = await getLocale();

  return (
    <nav className="flex items-center justify-between gap-4 border-b p-4 text-sm">
      <div className="flex gap-4">
        <Link href="/dashboard">Workspace</Link>
        <Link href="/guide">{t.navGuide}</Link>
        <Link href="/deals">Advanced</Link>
        <form action="/api/auth/logout" method="post"><button className="cursor-pointer">{t.navLogout}</button></form>
      </div>
      <LocaleSwitcher current={locale} />
    </nav>
  );
}
