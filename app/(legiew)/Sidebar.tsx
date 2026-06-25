"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/legiew/forms", label: "帳票一覧" },
  { href: "/legiew/links", label: "リンク一覧" },
  { href: "/legiew/faq", label: "問答集" },
];

export default function LegiewSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-y-auto">
      <nav className="flex flex-col py-4">
        {NAV_ITEMS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-6 py-3 text-sm transition-colors ${
              pathname === href
                ? "font-bold bg-[#3f4f5e] text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
