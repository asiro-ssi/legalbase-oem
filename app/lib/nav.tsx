import type { ReactNode } from "react";

/* サイドバーのメニュー定義。
   legalbase-agent（app/lib/nav.tsx）と同じアイコン・同じクラス名を使うが、
   こちらは公開ページで項目数も 3 つだけなので、
   グループ（フライアウト）は持たず素の項目だけを並べる。 */

export type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
};

/* ── アイコン（agent 側の nav.tsx からそのまま） ── */

const IconFaq = (
  <svg className="mp-nav-ic" viewBox="0 0 16 16" fill="none">
    <path d="M3 1.5h7l3 3v10h-10z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
    <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconForms = (
  <svg className="mp-nav-ic" viewBox="0 0 16 16" fill="none">
    <path d="M3 1.5h7l3 3v10h-10z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
    <path
      d="M5.5 8.5l1.8 1.8L10.5 7"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const IconLinks = (
  <svg className="mp-nav-ic" viewBox="0 0 16 16" fill="none">
    <path
      d="M9.5 6.5L12 4a2.2 2.2 0 00-3-3L6.5 3.5a2.2 2.2 0 003 3zM6.3 9.7L3 13l1 1 3.3-3.3M9.5 6.5L4 12"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * サイドバーのメニューを組み立てる。
 *
 * 並び順は 問答集 → 帳票一覧 → リンク一覧（改修前からの順番を維持）。
 * isLegiew が true のときは /legiew 配下のパスを返す。
 */
export function buildNav(isLegiew: boolean): NavItem[] {
  const prefix = isLegiew ? "/legiew" : "";

  return [
    { key: "faq", label: "問答集", href: `${prefix}/faq`, icon: IconFaq },
    { key: "forms", label: "帳票一覧", href: `${prefix}/forms`, icon: IconForms },
    { key: "links", label: "リンク一覧", href: `${prefix}/links`, icon: IconLinks },
  ];
}
