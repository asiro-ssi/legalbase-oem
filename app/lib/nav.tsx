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

const IconTop = (
  <svg className="mp-nav-ic" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 2.2a3 3 0 00-3 3v1.6c0 .9-.35 1.75-.98 2.38L3 10.2h10l-1.02-1.02A3.36 3.36 0 0111 6.8V5.2a3 3 0 00-3-3z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
    <path d="M6.3 12.2a1.7 1.7 0 003.4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

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
 * TOP のあとは 問答集 → 帳票一覧 → リンク一覧（改修前からの順番を維持）。
 * isLegiew が true のときは /legiew 配下のパスを返す。
 *
 * 通常版と LEGIEW 版は URL で分ける（クエリパラメータでの切り替えはしない）。
 * agent 側へ統合する際もこの方針を維持する。
 */
export function buildNav(isLegiew: boolean): NavItem[] {
  const prefix = isLegiew ? "/legiew" : "";

  return [
    // TOP だけは prefix そのもの（通常版は "/"、LEGIEW 版は "/legiew"）
    { key: "index", label: "TOP", href: prefix || "/", icon: IconTop },
    { key: "faq", label: "問答集", href: `${prefix}/faq`, icon: IconFaq },
    { key: "forms", label: "帳票一覧", href: `${prefix}/forms`, icon: IconForms },
    { key: "links", label: "リンク一覧", href: `${prefix}/links`, icon: IconLinks },
  ];
}
