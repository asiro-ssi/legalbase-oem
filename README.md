# LegalBase 募集人・OEM ポータル

募集人／OEM／トスアップ代理店向けの公開ポータル（Next.js 16 / React 19 / Tailwind CSS v4）。

代理店ポータル（`asiro-ssi/legalbase-agent`）の機能限定版で、
**デザインは代理店ポータルと共通のデザインシステムを使っています**。

## 開発

```bash
npm install
npm run dev
```

## 画面構成

| パス | 内容 |
| --- | --- |
| `/` | TOP（各機能へのカード） |
| `/faq` | 対顧客 想定問答集（Kintone App 295） |
| `/forms` | 帳票一覧（Kintone App 226） |
| `/links` | リンク一覧（Kintone App 247） |
| `/legiew` | LEGIEW 版の TOP |
| `/legiew/faq` `/legiew/forms` `/legiew/links` | 上記の LEGIEW 版 |

TOP のカードは代理店ポータルと同じ `.mp-link-card` を使っています（`app/features/HomeScreen.tsx`）。

このポータルは**ログインを伴わない公開ページ**です。
代理店ポータルと違い、認証・ユーザー表示・ログアウトは持ちません。

### 通常版と LEGIEW 版

**通常版と LEGIEW 版は URL で分けます（クエリパラメータでの表示切替はしません）。**
`/` 配下が通常版（すべて）、`/legiew` 配下が LEGIEW 版です。
代理店ポータルへ統合する際も、この URL で分ける方針を維持します。

同じ画面を両版で共用し、`isLegiew` フラグだけを切り替えています。
画面本体は `app/features/` に 1 つずつあり、`app/*/page.tsx` と `app/legiew/*/page.tsx` は
`isLegiew` を渡すだけの薄いラッパーです。**片方だけ直して差が出ることを防ぐため、
画面の実装は必ず `app/features/` 側に書いてください。**

LEGIEW 版の差分は次のとおりです（判定は `app/lib/legiew-filter.ts`）。

| 箇所 | 通常版 | LEGIEW 版 |
| --- | --- | --- |
| サイドバー | — | `by LEGIEW` バッジを表示 |
| 帳票一覧 | `代理店ページ公開 = on` | **`LEGIEWのみ = on` だけで判定**（`代理店ページ公開` は見ない） |
| 帳票一覧・リンク一覧 | 全件 | タイトルに `法務チャット` `THEMIL` を含むものを除外 |
| 問答集 | 全カテゴリ | `弁護士チャット` カテゴリを非表示 |

帳票一覧の LEGIEW 版は `LEGIEWのみ` のみで絞り込みます（代理店ポータルと同じ扱い）。
以前は `代理店ページ公開` も同時に見ていましたが、これは Kintone 側の設定不足に対する
暫定対応だったため廃止しました。**`LEGIEWのみ` が正なので、Kintone 側で確実に設定してください。**

> **代理店ポータル側との差異**：代理店ポータルは LEGIEW 判定を
> 代理店マスタ（Kintone App 293）のラジオボタン `switching`（ログインした代理店）で行いますが、
> こちらは URL で分けています。また代理店ポータルは
> 除外キーワード（`法務チャット` `THEMIL`）による絞り込みを持ちません。
> 統合時は、URL で分ける方針に寄せたうえで、除外キーワードを移植するかを決める必要があります。

## デザインシステムの同期ルール

スタイルは 3 段構成です。`app/globals.css` でこの順に読み込みます。

| ファイル | 役割 | 編集 |
| --- | --- | --- |
| `tailwindcss` | 一部の画面で残っているユーティリティ用 | — |
| `app/mypage.css` | デザインシステム本体 | **編集禁止** |
| `app/mypage-legalbase.css` | LegalBase 側の差分・追加分 | **編集禁止**（下記参照） |

### この 2 ファイルは直接編集しない

`app/mypage.css` と `app/mypage-legalbase.css` は
`legalbase-agent` の同名ファイルの**完全なコピー**です。
（`legalbase-agent` 側では、さらに `mypage.css` が `bonobo-asiro` からのコピーになっています。）

代理店ポータルとデザインを揃えるため、agent 側に変更が入ったら丸ごと上書きコピーして同期します。

```bash
cp ../legalbase-agent/app/mypage.css            app/mypage.css
cp ../legalbase-agent/app/mypage-legalbase.css  app/mypage-legalbase.css
```

差分が出ないようにしておくことで `diff` で同期状況を確認できます。

```bash
diff ../legalbase-agent/app/mypage.css app/mypage.css
```

**このポータル固有のスタイル調整が必要になった場合は、
agent 側の `mypage-legalbase.css` に入れるか、新しく 4 段目のファイルを作ってください。**

### agent 側と共通のファイル

次のファイルも agent 側からのコピーで、内容を一致させています（`diff` が空になります）。

| ファイル | コピー元 |
| --- | --- |
| `app/lib/kintone.ts` | `legalbase-agent/app/lib/kintone.ts` |
| `app/components/PageHead.tsx` | `legalbase-agent/app/components/PageHead.tsx` |

`app/components/PortalShell.tsx` `Sidebar.tsx` `GlobalHeader.tsx` は
agent 側と同じクラス名・同じ見た目を使いますが、
認証を持たない分（ユーザー表示・ログアウト・サブメニュー）が削られた別実装です。

## 環境変数

| 変数 | 用途 |
| --- | --- |
| `KINTONE_BASE_URL` | Kintone のベース URL |
| `KINTONE_APP226_TOKEN` | 帳票（App 226） |
| `KINTONE_APP247_TOKEN` | リンク集（App 247） |
| `KINTONE_APP295_TOKEN` | 想定問答集（App 295） |

いずれも `legalbase-agent` と同じアプリ・同じ変数名です。

## データを常に最新で出す

各ページは `export const dynamic = "force-dynamic"` を宣言しています。
これがないと Kintone の内容がビルド時点で固定されてしまうため、**外さないでください。**
（代理店ポータル側は認証がリクエスト時 API を使うため、この宣言なしで動的になります。）
