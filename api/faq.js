const CATEGORY_ORDER = [
  "リーガルチェック",
  "反社チェック",
  "ひな形",
  "文書管理機能",
  "弁護士チャット",
  "その他",
];

export default async function handler(req, res) {
  const BASE_URL = process.env.KINTONE_BASE_URL;
  const TOKEN = process.env.KINTONE_APP295_TOKEN;

  if (!BASE_URL || !TOKEN) {
    return res.status(500).json({ error: "環境変数が設定されていません" });
  }

  const params = new URLSearchParams();
  params.set("app", "295");
  params.set("query", "order by レコード番号 asc");
  ["category", "question", "answer", "レコード番号"].forEach((f, i) => {
    params.set(`fields[${i}]`, f);
  });

  const kintoneUrl = `${BASE_URL}/k/v1/records.json?${params}`;

  let kintoneRes;
  try {
    kintoneRes = await fetch(kintoneUrl, {
      headers: { "X-Cybozu-API-Token": TOKEN },
    });
  } catch (err) {
    return res.status(500).json({ error: "Kintone への接続に失敗しました" });
  }

  if (!kintoneRes.ok) {
    const text = await kintoneRes.text();
    return res.status(502).json({ error: text });
  }

  const data = await kintoneRes.json();
  const grouped = {};

  for (const r of data.records || []) {
    const cat = r.category?.value || "その他";
    const q = r.question?.value || "";
    const a = r.answer?.value || "";
    if (!q) continue;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ q, a: a.split(/\n\n+/).filter(Boolean) });
  }

  const categories = CATEGORY_ORDER
    .filter((c) => grouped[c])
    .map((c) => ({ label: c, items: grouped[c] }));

  for (const cat of Object.keys(grouped)) {
    if (!CATEGORY_ORDER.includes(cat)) {
      categories.push({ label: cat, items: grouped[cat] });
    }
  }

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
  return res.status(200).json({ categories });
}
