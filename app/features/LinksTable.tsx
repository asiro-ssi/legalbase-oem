"use client";

import { useState } from "react";
import { fieldText, type KintoneRecord } from "../lib/kintone";
import { isLegiewRecordVisible } from "../lib/legiew-filter";

const ALL = "すべて";

export default function LinksTable({
  records,
  isLegiew,
}: {
  records: KintoneRecord[];
  isLegiew: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<string>(ALL);

  // 「代理店ページ公開」が on のレコードだけに絞り込む。
  // LEGIEW 版はさらに、除外キーワードを含むタイトルを落とす。
  const publishedRecords = records.filter((record) => {
    if (fieldText(record, "代理店ページ公開").toLowerCase().trim() !== "on") return false;
    return isLegiew ? isLegiewRecordVisible(fieldText(record, "Title")) : true;
  });

  // データ内のカテゴリを集計してフィルターボタンを作る
  const categories = [
    ALL,
    ...Array.from(new Set(publishedRecords.map((r) => fieldText(r, "category")).filter(Boolean))),
  ];

  const filteredRecords =
    activeFilter === ALL
      ? publishedRecords
      : publishedRecords.filter((record) => fieldText(record, "category") === activeFilter);

  return (
    <div className="mp-list-card">
      <div className="mp-list-card-toolbar">
        <div className="mp-doc-category-tabs">
          {categories.map((category) => (
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
        {filteredRecords.length === 0 ? (
          <div className="mp-doc-empty">該当するリンクがありません。</div>
        ) : (
          <div className="mp-doc-table-wrap">
            <table className="mp-doc-table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>カテゴリ</th>
                  <th>タイトル / 説明</th>
                  <th style={{ width: 140, textAlign: "right" }}>リンク</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const url = fieldText(record, "リンク");
                  const description = fieldText(record, "Description");

                  return (
                    <tr key={fieldText(record, "レコード番号")}>
                      <td data-label="カテゴリ">{fieldText(record, "category") || "未分類"}</td>
                      <td data-label="タイトル">
                        <div className="mp-cell-strong">{fieldText(record, "Title") || "(タイトルなし)"}</div>
                        {description && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--mp-text-sub)",
                              marginTop: 3,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {description}
                          </div>
                        )}
                      </td>
                      <td data-label="リンク">
                        {url ? (
                          <div className="mp-document-downloads">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mp-document-download-btn"
                            >
                              開く ↗
                            </a>
                          </div>
                        ) : (
                          <span style={{ color: "var(--mp-text-hint)", fontSize: 11 }}>URLなし</span>
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
