import { Metadata } from "next";
import FormsScreen from "../features/FormsScreen";

export const metadata: Metadata = {
  title: "帳票一覧 | LegalBase",
};

// Kintone の内容を常に最新で出す（ビルド時の内容で固定させない）
export const dynamic = "force-dynamic";

export default function Page() {
  return <FormsScreen isLegiew={false} />;
}
