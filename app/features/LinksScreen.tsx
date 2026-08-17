import LinksTable from "./LinksTable";
import PortalShell from "../components/PortalShell";
import PageHead from "../components/PageHead";
import { fetchRecords } from "../lib/kintone";

/** リンク集（Kintone App 247） */
const LINKS_APP_ID = 247;

/**
 * リンク一覧の画面本体。通常版と LEGIEW 版で共用する。
 * 絞り込み（代理店ページ公開／除外キーワード）は LinksTable 側で行う。
 */
export default async function LinksScreen({ isLegiew }: { isLegiew: boolean }) {
  const { records, error } = await fetchRecords({
    app: LINKS_APP_ID,
    token: process.env.KINTONE_APP247_TOKEN,
  });

  return (
    <PortalShell isLegiew={isLegiew}>
      <PageHead
        title="リンク一覧"
        sub="外部サイトやツールへのリンクをまとめています。"
        help="営業活動で使う外部サイト・ツールへのリンク集です。"
      />

      {error ? (
        <div className="mp-error-box">
          <strong>Kintone からのデータ取得に失敗しました。</strong>
          <pre>{error}</pre>
        </div>
      ) : (
        <LinksTable records={records} isLegiew={isLegiew} />
      )}
    </PortalShell>
  );
}
