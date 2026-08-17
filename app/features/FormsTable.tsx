"use client";

import { useState } from "react";
import { fieldFiles, fieldText, type KintoneRecord } from "../lib/kintone";
import { isLegiewRecordVisible } from "../lib/legiew-filter";

const CATEGORIES = ["提案資料", "デモ動画", "バナー", "マニュアル"];
const DEFAULT_FILTER = "提案資料";

type SortKey = "category" | "title" | "file";

export default function FormsTable({
  records,
  isLegiew,
}: {
  records: KintoneRecord[];
  isLegiew: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<string>(DEFAULT_FILTER);
  const [sortKey, setSortKey] = useState<SortKey>("category");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // 「代理店ページ公開」が on のものだけに絞り込む。
  // LEGIEW 版はさらに「LEGIEWのみ」= on かつ、除外キーワードを含まないタイトルだけにする。
  const publishedRecords = records.filter((record) => {
    if (fieldText(record, "代理店ページ公開").toLowerCase().trim() !== "on") return false;
    if (!isLegiew) return true;
    if (fieldText(record, "LEGIEWのみ").toLowerCase().trim() !== "on") return false;
    return isLegiewRecordVisible(fieldText(record, "Title"));
  });

  const filteredRecords = activeFilter
    ? publishedRecords.filter((record) => fieldText(record, "category") === activeFilter)
    : publishedRecords;

  const getSortValue = (record: KintoneRecord, key: SortKey) => {
    if (key === "category") return fieldText(record, "category");
    if (key === "title") return fieldText(record, "Title");
    return fieldFiles(record, "File").length > 0 ? "1" : "0";
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const cmp = getSortValue(a, sortKey).localeCompare(getSortValue(b, sortKey), "ja");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <span className="mp-sort-ic">⇅</span>;
    return <span className="mp-sort-ic active">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="mp-list-card">
      <div className="mp-list-card-toolbar">
        <div className="mp-doc-category-tabs">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveFilter(category)}
              className={`mp-doc-category-tab${activeFilter === category ? " active" : ""}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="mp-list-card-body">
        {sortedRecords.length === 0 ? (
          <div className="mp-doc-empty">該当する帳票がありません。</div>
        ) : (
          <div className="mp-doc-table-wrap">
            <table className="mp-doc-table">
              <thead>
                <tr>
                  <th className="mp-th-sortable" style={{ width: 160 }} onClick={() => handleSort("category")}>
                    カテゴリ {sortIcon("category")}
                  </th>
                  <th className="mp-th-sortable" onClick={() => handleSort("title")}>
                    タイトル {sortIcon("title")}
                  </th>
                  <th
                    className="mp-th-sortable"
                    style={{ width: 180, textAlign: "right" }}
                    onClick={() => handleSort("file")}
                  >
                    ダウンロード {sortIcon("file")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((record) => {
                  const files = fieldFiles(record, "File");
                  return (
                    <tr key={fieldText(record, "$id") || fieldText(record, "レコード番号")}>
                      <td data-label="カテゴリ">{fieldText(record, "category") || "未分類"}</td>
                      <td data-label="タイトル" className="mp-cell-strong">
                        {fieldText(record, "Title") || "(タイトルなし)"}
                      </td>
                      <td data-label="ダウンロード">
                        {files.length === 0 ? (
                          <span style={{ color: "var(--mp-text-hint)", fontSize: 11 }}>ファイルなし</span>
                        ) : (
                          <div className="mp-document-downloads">
                            {files.map((file, index) => (
                              <a
                                key={file.fileKey}
                                href={`/api/kintone-file?fileKey=${encodeURIComponent(file.fileKey)}`}
                                download={file.name}
                                className="mp-document-download-btn"
                              >
                                ⬇ ダウンロード {files.length > 1 ? index + 1 : ""}
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
