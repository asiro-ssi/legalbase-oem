import PortalShell from "../components/PortalShell";
import PageHead from "../components/PageHead";
import { fetchRecords, fieldText } from "../lib/kintone";
import { isLegiewFaqCategoryVisible } from "../lib/legiew-filter";

/** 想定問答集（Kintone App 295） */
const FAQ_APP_ID = 295;

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
  return text.split(/\n\n+/).map((paragraph, i) => (
    <p key={i}>
      {paragraph.split("\n").map((line, j) => (
        <span key={j}>
          {j > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  ));
}

/**
 * 想定問答集の画面本体。通常版と LEGIEW 版で共用する。
 * LEGIEW 版では表示しないカテゴリがある（lib/legiew-filter.ts）。
 */
export default async function FaqScreen({ isLegiew }: { isLegiew: boolean }) {
  const { records, error } = await fetchRecords({
    app: FAQ_APP_ID,
    token: process.env.KINTONE_APP295_TOKEN,
    query: "order by レコード番号 asc",
    fields: ["category", "question", "answer", "レコード番号"],
  });

  const grouped: Record<string, FaqItem[]> = {};
  for (const record of records) {
    const question = fieldText(record, "question");
    if (!question) continue;
    const category = fieldText(record, "category") || "その他";
    if (isLegiew && !isLegiewFaqCategoryVisible(category)) continue;
    (grouped[category] ??= []).push({ question, answer: fieldText(record, "answer") });
  }

  const categories: CategoryGroup[] = CATEGORY_ORDER.filter((c) => grouped[c]).map((c) => ({
    label: c,
    items: grouped[c],
  }));

  for (const category of Object.keys(grouped)) {
    if (!CATEGORY_ORDER.includes(category)) {
      categories.push({ label: category, items: grouped[category] });
    }
  }

  return (
    <PortalShell isLegiew={isLegiew}>
      <PageHead
        title="対顧客 想定問答集"
        sub="よくある質問とその回答例をカテゴリ別にまとめています。"
        help="質問をクリックすると回答が開きます。商談時の想定問答としてご利用ください。"
      />

      {error ? (
        <div className="mp-error-box">
          <strong>Kintone からのデータ取得に失敗しました。</strong>
          <pre>{error}</pre>
        </div>
      ) : categories.length === 0 ? (
        <div className="mp-empty">
          <div className="mp-empty-title">問答集がまだ登録されていません</div>
          <div className="mp-empty-sub">内容が登録されると、こちらに表示されます。</div>
        </div>
      ) : (
        <div>
          {categories.map((category) => (
            <section key={category.label} className="mp-faq-sec">
              <div className="mp-faq-sec-hd">
                <span className="mp-faq-cat">{category.label}</span>
                <span className="mp-faq-count">{category.items.length}件</span>
              </div>

              <div className="mp-faq-list">
                {category.items.map((item, index) => (
                  <details key={index} className="mp-faq-item">
                    <summary className="mp-faq-q">
                      <span className="mp-faq-mark mp-faq-mark-q">Q</span>
                      <span className="mp-faq-q-text">{item.question}</span>
                      <span className="mp-faq-chevron">▼</span>
                    </summary>
                    <div className="mp-faq-a">
                      <span className="mp-faq-mark mp-faq-mark-a">A</span>
                      <div className="mp-faq-a-body">{renderAnswer(item.answer)}</div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
