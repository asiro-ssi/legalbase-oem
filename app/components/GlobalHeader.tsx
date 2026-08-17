"use client";

import { useEffect, useRef } from "react";

/* PC 表示時のヘッダー背景。agent 側の GlobalHeader と同じ画像をランダムに出す。
   サーバー側で選ぶとハイドレーション不一致になるため、マウント後に DOM へ直接当てる。 */
const HEADER_BACKGROUNDS = [
  "https://bonobo-documents.s3.ap-northeast-1.amazonaws.com/legalbase/img/back_yoru.png",
  "https://bonobo-documents.s3.ap-northeast-1.amazonaws.com/legalbase/img/back_yuhi.png",
  "https://bonobo-documents.s3.ap-northeast-1.amazonaws.com/legalbase/img/back_mizu.png",
  "https://bonobo-documents.s3.ap-northeast-1.amazonaws.com/legalbase/img/back_suihei.png",
  "https://bonobo-documents.s3.ap-northeast-1.amazonaws.com/legalbase/img/back_earth.png",
  "https://bonobo-documents.s3.ap-northeast-1.amazonaws.com/legalbase/img/back_light.png",
  "https://bonobo-documents.s3.ap-northeast-1.amazonaws.com/legalbase/img/back_hiru.png",
];

/**
 * グローバルヘッダー。
 * agent 側と違いこのポータルはログインを伴わないため、
 * 右端のログインユーザー表示は持たない（ハンバーガーのみ）。
 */
export default function GlobalHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 769px)").matches) return;
    const header = headerRef.current;
    if (!header) return;
    const image = HEADER_BACKGROUNDS[Math.floor(Math.random() * HEADER_BACKGROUNDS.length)];
    header.style.backgroundImage = `url(${image})`;
  }, []);

  return (
    <header className="mp-global-header" ref={headerRef}>
      <div className="mp-global-header-inner" style={{ justifyContent: "flex-end" }}>
        <div className="mp-global-header-sp-left">
          <button
            type="button"
            className="mp-hamburger"
            onClick={onOpenSidebar}
            aria-label="メニューを開く"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="var(--mp-text)" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
