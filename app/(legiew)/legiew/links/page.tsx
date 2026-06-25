import { Metadata } from "next";
import LegiewLinksTable from "./LinksTable";

export const metadata: Metadata = {
  title: "リンク一覧 | LegalBase",
};

export default async function LegiewLinksPage() {
  let records: Record<string, unknown>[] = [];
  let kintoneError: string | null = null;

  try {
    const kintoneUrl = `${process.env.KINTONE_BASE_URL}/k/v1/records.json?app=247`;
    const res = await fetch(kintoneUrl, {
      method: "GET",
      headers: { "X-Cybozu-API-Token": process.env.KINTONE_APP247_TOKEN! },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      records = data.records ?? [];
    } else {
      kintoneError = await res.text();
    }
  } catch (error: unknown) {
    kintoneError = error instanceof Error ? error.message : "不明なエラー";
  }

  return (
    <main className="flex-1 p-6 bg-slate-50 flex flex-col overflow-hidden">
      <div className="bg-white border border-gray-200 shadow-sm flex flex-col flex-1 rounded-sm overflow-hidden">
        <div className="px-6 py-5 flex-shrink-0 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">リンク一覧</h1>
          <p className="text-sm text-gray-500">外部サイトやツールへのリンクをまとめています。</p>
        </div>

        {kintoneError ? (
          <div className="p-6 text-sm text-red-600 bg-red-50 m-6 rounded border border-red-200">
            <p className="font-bold">⚠️ Kintoneからのデータ取得に失敗しました：</p>
            <pre className="mt-2 text-xs overflow-x-auto bg-white p-2 border">{kintoneError}</pre>
          </div>
        ) : (
          <LegiewLinksTable records={records} />
        )}
      </div>
    </main>
  );
}
