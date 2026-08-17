import { Metadata } from "next";
import FaqScreen from "../features/FaqScreen";

export const metadata: Metadata = {
  title: "想定問答集 | LegalBase",
};

// Kintone の内容を常に最新で出す（ビルド時の内容で固定させない）
export const dynamic = "force-dynamic";

export default function Page() {
  return <FaqScreen isLegiew={false} />;
}
