import FormsTable from "./FormsTable";
import PortalShell from "../components/PortalShell";
import PageHead from "../components/PageHead";
import { fetchRecords } from "../lib/kintone";

/** 帳票（Kintone App 226） */
const FORMS_APP_ID = 226;

/**
 * 帳票一覧の画面本体。通常版と LEGIEW 版で共用する。
 * 絞り込み（代理店ページ公開／LEGIEWのみ／除外キーワード）は FormsTable 側で行う。
 */
export default async function FormsScreen({ isLegiew }: { isLegiew: boolean }) {
  const { records, error } = await fetchRecords({
    app: FORMS_APP_ID,
    token: process.env.KINTONE_APP226_TOKEN,
  });

  return (
    <PortalShell isLegiew={isLegiew}>
      <PageHead
        title="帳票一覧"
        sub="カテゴリで絞り込み、列名クリックで並び替えができます。"
        help="提案資料やデモ動画などをダウンロードできるページです。"
      />

      {error ? (
        <div className="mp-error-box">
          <strong>Kintone からのデータ取得に失敗しました。</strong>
          <pre>{error}</pre>
        </div>
      ) : (
        <FormsTable records={records} isLegiew={isLegiew} />
      )}
    </PortalShell>
  );
}
