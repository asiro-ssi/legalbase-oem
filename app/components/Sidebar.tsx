"use client";

import Link from "next/link";
import type { NavItem } from "../lib/nav";

/**
 * サイドバー。agent 側の Sidebar と同じマークアップ・同じクラス名を使う。
 * こちらは公開ページなのでログアウトボタンは持たず、
 * 項目も 3 つだけなのでグループ（フライアウト）も持たない。
 */
export default function Sidebar({
  nav,
  pathname,
  isOpen,
  badge,
}: {
  nav: NavItem[];
  pathname: string;
  isOpen: boolean;
  /** ロゴ横に出すバッジ（LEGIEW 版で「by LEGIEW」を出す） */
  badge?: string;
}) {
  return (
    <nav className={`mp-sidebar mp-sidebar-with-header${isOpen ? " open" : ""}`}>
      <div className="mp-sidebar-logo">
        <Link href={nav[0].href} className="mp-sidebar-logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://legal-base.vercel.app/img/legalbase-logo.svg"
            alt="LegalBase"
            className="mp-sidebar-logo-img"
          />
          <div className="mp-sidebar-logo-text">
            ポータル
            <small>LegalBase</small>
          </div>
        </Link>
        {badge && <span className="mp-agent-badge">{badge}</span>}
      </div>

      <div className="mp-sidebar-section">メニュー</div>

      {nav.map((item) => (
        <Link
          key={item.key}
          className={`mp-nav-item${pathname === item.href ? " active" : ""}`}
          href={item.href}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}

      <div className="mp-sidebar-spacer" />
      <div className="mp-sidebar-divider" />
    </nav>
  );
}
