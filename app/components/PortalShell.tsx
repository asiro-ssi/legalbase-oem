"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { buildNav } from "../lib/nav";
import GlobalHeader from "./GlobalHeader";
import Sidebar from "./Sidebar";

/**
 * 全ページ共通のガワ（グローバルヘッダー＋サイドバー＋メイン）。
 * legalbase-agent の app/components/PortalShell.tsx と対になるもので、
 * 同じデザインシステム（mypage.css）のクラスを使う。
 *
 * agent 側との違いは次の 2 点。
 *  - ログインを伴わないため、ヘッダーのユーザー表示とログアウトを持たない
 *  - メニューが 3 項目だけなので、サブメニュー（PC のフライアウト／SP の横タブ）を持たない
 */
export default function PortalShell({
  isLegiew,
  children,
}: {
  /** LEGIEW 版（/legiew 配下）かどうか */
  isLegiew: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const nav = buildNav(isLegiew);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ページ遷移したら SP のドロワーを閉じる。
  // 副作用ではなくレンダー中に state を調整する（React 推奨の「前回の値と比べる」書き方）。
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  if (renderedPathname !== pathname) {
    setRenderedPathname(pathname);
    setSidebarOpen(false);
  }

  // SP のドロワーを開いている間は背面をスクロールさせない
  useEffect(() => {
    if (!sidebarOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [sidebarOpen]);

  return (
    <>
      <GlobalHeader onOpenSidebar={() => setSidebarOpen(true)} />

      <div
        className={`mp-sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="mp-layout mp-layout-with-header">
        <Sidebar
          nav={nav}
          pathname={pathname}
          isOpen={sidebarOpen}
          badge={isLegiew ? "by LEGIEW" : undefined}
        />

        <main className="mp-main">
          {children}

          <p className="mp-footer">
            Copyright 2026 ASiRO Small Amount and Short Term Insurance Co., Ltd.
          </p>
        </main>
      </div>
    </>
  );
}
