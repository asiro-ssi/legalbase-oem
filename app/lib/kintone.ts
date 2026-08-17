/** Kintone REST API の薄いラッパー。
 *  改修前は各ページが fetch と try/catch を個別に書いていたため、共通化した。 */

export type KintoneValue = { value: unknown };
export type KintoneRecord = Record<string, KintoneValue | undefined>;

/** レコードの単一フィールドを文字列として取り出す */
export function fieldText(record: KintoneRecord | null | undefined, code: string): string {
  const value = record?.[code]?.value;
  return typeof value === "string" ? value : "";
}

/** 添付ファイルフィールドを取り出す */
export function fieldFiles(
  record: KintoneRecord | null | undefined,
  code: string
): { fileKey: string; name: string }[] {
  const value = record?.[code]?.value;
  return Array.isArray(value) ? (value as { fileKey: string; name: string }[]) : [];
}

/** チェックボックス等の複数選択フィールドを取り出す */
export function fieldList(record: KintoneRecord | null | undefined, code: string): string[] {
  const value = record?.[code]?.value;
  return Array.isArray(value) ? (value as string[]) : [];
}

export type FetchRecordsResult = {
  records: KintoneRecord[];
  /** 取得に失敗したときだけメッセージが入る（画面に出す用） */
  error: string | null;
};

export async function fetchRecords(options: {
  app: number;
  token: string | undefined;
  query?: string;
  fields?: string[];
}): Promise<FetchRecordsResult> {
  const { app, token, query, fields } = options;

  if (!token) {
    const error = `Kintone アプリ ${app} の API トークンが設定されていません。`;
    console.error(error);
    return { records: [], error };
  }

  try {
    const params = new URLSearchParams();
    params.set("app", String(app));
    if (query) params.set("query", query);
    fields?.forEach((f, i) => params.set(`fields[${i}]`, f));

    const res = await fetch(`${process.env.KINTONE_BASE_URL}/k/v1/records.json?${params}`, {
      method: "GET",
      headers: { "X-Cybozu-API-Token": token },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.text();
      console.error(`Kintone 通信エラー (app=${app}):`, error);
      return { records: [], error };
    }

    const data = await res.json();
    return { records: (data.records as KintoneRecord[]) ?? [], error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`データ取得エラー (app=${app}):`, error);
    return { records: [], error: message };
  }
}

/** 1 レコードだけ取得する。該当なしなら null。 */
export async function fetchOneRecord(options: {
  app: number;
  token: string | undefined;
  query: string;
}): Promise<KintoneRecord | null> {
  const { records } = await fetchRecords({ ...options, query: `${options.query} limit 1` });
  return records[0] ?? null;
}

/** レコードを更新する。成功時 true。 */
export async function updateRecord(options: {
  app: number;
  token: string | undefined;
  id: string;
  record: Record<string, { value: string }>;
}): Promise<boolean> {
  const { app, token, id, record } = options;

  if (!token) {
    console.error(`Kintone アプリ ${app} の API トークンが設定されていません。`);
    return false;
  }

  try {
    const res = await fetch(`${process.env.KINTONE_BASE_URL}/k/v1/record.json`, {
      method: "PUT",
      headers: {
        "X-Cybozu-API-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ app, id, record }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Kintone 更新エラー (app=${app}):`, await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Kintone 更新中に例外が発生しました (app=${app}):`, error);
    return false;
  }
}
