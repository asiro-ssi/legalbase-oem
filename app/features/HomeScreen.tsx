import Link from "next/link";
import type { ReactNode } from "react";
import PortalShell from "../components/PortalShell";
import PageHead from "../components/PageHead";

/* TOP のカードに載せるアイコン。agent 側の app/page.tsx と同じ
   線の太さ（1.5）・角の丸めに揃えている。 */

const IconFaq = (
  <svg className="mp-link-card-ic" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 3.5h16a1.5 1.5 0 011.5 1.5v10a1.5 1.5 0 01-1.5 1.5h-7l-4.5 3.5V16.5H4A1.5 1.5 0 012.5 15V5A1.5 1.5 0 014 3.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M10 8.6a2.1 2.1 0 113.1 1.85c-.7.4-1.1.9-1.1 1.65"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M12 14.6h0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const IconForms = (
  <svg className="mp-link-card-ic" viewBox="0 0 24 24" fill="none">
    <path d="M5 2.5h8.5L19 8v13.5H5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M13 2.5V8h5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path
      d="M12 11.5v6M9.3 14.8L12 17.5l2.7-2.7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconLinks = (
  <svg className="mp-link-card-ic" viewBox="0 0 24 24" fill="none">
    <path
      d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type Card = {
  href: string;
  title: string;
  sub: string;
  icon: ReactNode;
};

/** TOP に並べるカード。サイドバーと同じ並び順にしている。 */
function buildCards(isLegiew: boolean): Card[] {
  const prefix = isLegiew ? "/legiew" : "";

  return [
    {
      href: `${prefix}/faq`,
      title: "問答集",
      sub: "対顧客の想定問答をカテゴリ別に確認",
      icon: IconFaq,
    },
    {
      href: `${prefix}/forms`,
      title: "帳票一覧",
      sub: "提案資料・デモ動画のダウンロード",
      icon: IconForms,
    },
    {
      href: `${prefix}/links`,
      title: "リンク一覧",
      sub: "外部サイト・ツールへのリンク集",
      icon: IconLinks,
    },
  ];
}

/**
 * TOP の画面本体。通常版（/）と LEGIEW 版（/legiew）で共用する。
 * agent 側の app/page.tsx と同じ .mp-link-card を使う。
 */
export default function HomeScreen({ isLegiew }: { isLegiew: boolean }) {
  return (
    <PortalShell isLegiew={isLegiew}>
      <PageHead
        title="TOP"
        sub="営業に必要なツールや情報をまとめています。"
        help="左のメニュー、または下のカードから各機能をご利用いただけます。"
      />

      <div className="mp-link-cards">
        {buildCards(isLegiew).map((card) => (
          <Link key={card.href} className="mp-link-card" href={card.href}>
            {card.icon}
            <div className="mp-link-card-title">{card.title}</div>
            <div className="mp-link-card-sub">{card.sub}</div>
          </Link>
        ))}
      </div>
    </PortalShell>
  );
}
