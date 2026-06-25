import { Metadata } from "next";
import { isLegiewFaqCategoryVisible } from "@/app/lib/legiew-filter";

export const metadata: Metadata = {
  title: "想定問答集 | LegalBase",
};

const CATEGORY_ORDER = [
  "リーガルチェック",
  "反社チェック",
  "ひな形",
  "文書管理機能",
  "弁護士チャット",
  "その他",
];

type FaqItem = { question: string; answer: string };
type CategoryGroup = { label: string; items: FaqItem[] };

function renderAnswer(text: string) {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((p, i) => {
    const lines = p.split("\n");
    return (
      <p key={i} className={i > 0 ? "mt-3 text-gray-700 leading-relaxed" : "text-gray-700 leading-relaxed"}>
        {lines.map((line, j) => (
          <span key={j}>
            {j > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    );
  });
}

export default async function LegiewFaqPage() {
  let categories: CategoryGroup[] = [];
  let fetchError: string | null = null;

  try {
    const params = new URLSearchParams();
    params.set("app", "295");
    params.set("query", "order by レコード番号 asc");
    ["category", "question", "answer", "レコード番号"].forEach((f, i) => {
      params.set(`fields[${i}]`, f);
    });

    const kintoneUrl = `${process.env.KINTONE_BASE_URL}/k/v1/records.json?${params}`;
    const res = await fetch(kintoneUrl, {
      method: "GET",
      headers: { "X-Cybozu-API-Token": process.env.KINTONE_APP295_TOKEN! },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const grouped: Record<string, FaqItem[]> = {};
      for (const r of data.records ?? []) {
        const cat: string = r.category?.value ?? "その他";
        const q: string = r.question?.value ?? "";
        const a: string = r.answer?.value ?? "";
        if (!q) continue;
        if (!isLegiewFaqCategoryVisible(cat)) continue;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({ question: q, answer: a });
      }

      categories = CATEGORY_ORDER
        .filter((cat) => grouped[cat])
        .map((cat) => ({ label: cat, items: grouped[cat] }));

      for (const cat of Object.keys(grouped)) {
        if (!CATEGORY_ORDER.includes(cat)) {
          categories.push({ label: cat, items: grouped[cat] });
        }
      }
    } else {
      fetchError = await res.text();
    }
  } catch (error: unknown) {
    fetchError = error instanceof Error ? error.message : "不明なエラー";
  }

  return (
    <main className="flex-1 p-6 bg-slate-50 overflow-y-auto">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">対顧客 想定問答集</h1>
          <p className="text-sm text-gray-500">よくある質問とその回答例をカテゴリ別にまとめています。各質問をクリックすると回答が表示されます。</p>
        </div>

        {fetchError ? (
          <div className="p-6 text-sm text-red-600 bg-red-50 m-6 rounded border border-red-200">
            <p className="font-bold">⚠️ Kintoneからのデータ取得に失敗しました：</p>
            <pre className="mt-2 text-xs overflow-x-auto bg-white p-2 border">{fetchError}</pre>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {categories.map((cat) => (
              <section key={cat.label}>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="inline-block px-3 py-1 text-sm font-semibold"
                    style={{ backgroundColor: "#171717", color: "#fff" }}
                  >
                    {cat.label}
                  </span>
                  <span className="text-xs text-gray-400">{cat.items.length}件</span>
                </div>

                <div className="space-y-2 max-w-[900px]">
                  {cat.items.map((item, idx) => (
                    <details key={idx} className="group border border-gray-200 rounded-md overflow-hidden">
                      <summary className="flex items-start gap-3 px-4 py-3 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors list-none [&::-webkit-details-marker]:hidden">
                        <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#3f4f5e] text-white text-xs flex items-center justify-center font-bold">Q</span>
                        <span className="text-sm font-medium text-gray-800 flex-1">{item.question}</span>
                        <span className="flex-shrink-0 text-gray-400 text-xs mt-1 group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-4 py-4 bg-white border-t border-gray-100">
                        <div className="flex gap-3">
                          <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">A</span>
                          <div className="text-sm flex-1">
                            {renderAnswer(item.answer)}
                          </div>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
