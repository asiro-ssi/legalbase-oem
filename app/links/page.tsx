import { Metadata } from "next";
import LinksScreen from "../features/LinksScreen";

export const metadata: Metadata = {
  title: "リンク一覧 | LegalBase",
};

// Kintone の内容を常に最新で出す（ビルド時の内容で固定させない）
export const dynamic = "force-dynamic";

export default function Page() {
  return <LinksScreen isLegiew={false} />;
}
