"use client";

import { useState } from "react";
import { isLegiewRecordVisible } from "@/app/lib/legiew-filter";

const CATEGORIES = ["提案資料", "デモ動画", "バナー", "マニュアル"];
const DEFAULT_FILTER = "提案資料";

export default function LegiewFormsTable({ records }: { records: Record<string, unknown>[] }) {
  const [activeFilter, setActiveFilter] = useState<string>(DEFAULT_FILTER);
  const [sortKey, setSortKey] = useState<string>("category");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const publishedRecords = records.filter((r) => {
    const val = (r["代理店ページ公開"] as { value?: string } | undefined)?.value;
    if (!val || val.toLowerCase().trim() !== "on") return false;
    const legiewOnly = (r["LEGIEWのみ"] as { value?: string } | undefined)?.value;
    if (!legiewOnly || legiewOnly.toLowerCase().trim() !== "on") return false;
    const title = (r.Title as { value?: string } | undefined)?.value ?? "";
    return isLegiewRecordVisible(title);
  });

  const filteredRecords = activeFilter
    ? publishedRecords.filter((r) => ((r.category as { value?: string } | undefined)?.value ?? "") === activeFilter)
    : publishedRecords;

  const getSortValue = (record: Record<string, unknown>, key: string) => {
    if (key === "category") return (record.category as { value?: string } | undefined)?.value ?? "";
    if (key === "title") return (record.Title as { value?: string } | undefined)?.value ?? "";
    if (key === "file") return ((record.File as { value?: unknown[] } | undefined)?.value?.length ?? 0) > 0 ? "1" : "0";
    return "";
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const va = getSortValue(a, sortKey);
    const vb = getSortValue(b, sortKey);
    const cmp = va.localeCompare(vb, "ja");
    return sortDir === "asc" ? cmp : -cmp;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return <span className="ml-1 text-gray-300">⇅</span>;
    return sortDir === "asc" ? <span className="ml-1 text-blue-500">↑</span> : <span className="ml-1 text-blue-500">↓</span>;
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-1.5 text-sm font-bold rounded-full border transition-colors ${
              activeFilter === cat
                ? "bg-[#3f4f5e] border-[#3f4f5e] text-white"
                : "bg-white border-gray-300 text-gray-500 hover:border-[#3f4f5e] hover:text-[#3f4f5e]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedRecords.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 text-center">
            該当する帳票がありません。
          </div>
        ) : (
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-[#3f4f5e] text-white sticky top-0 z-10 shadow-sm">
              <tr>
                <th onClick={() => handleSort("category")} className="px-6 py-3 text-xs font-semibold cursor-pointer hover:bg-slate-600 transition-colors whitespace-nowrap w-40 select-none">
                  カテゴリ {renderSortIcon("category")}
                </th>
                <th onClick={() => handleSort("title")} className="px-6 py-3 text-xs font-semibold cursor-pointer hover:bg-slate-600 transition-colors select-none">
                  タイトル {renderSortIcon("title")}
                </th>
                <th onClick={() => handleSort("file")} className="px-6 py-3 text-xs font-semibold cursor-pointer hover:bg-slate-600 transition-colors whitespace-nowrap w-40 text-right select-none">
                  ダウンロード {renderSortIcon("file")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedRecords.map((record) => {
                const cat = (record.category as { value?: string } | undefined)?.value ?? "未分類";
                const title = (record.Title as { value?: string } | undefined)?.value ?? "(タイトルなし)";
                const files = (record.File as { value?: { fileKey: string; name: string }[] } | undefined)?.value ?? [];
                const id = (record["$id"] as { value?: string } | undefined)?.value;

                return (
                  <tr key={id ?? Math.random()} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                      {cat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 group-hover:text-blue-600 transition-colors font-medium">
                      {title}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {files.length === 0 ? (
                        <span className="text-gray-400 text-xs">ファイルなし</span>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          {files.map((f, i) => (
                            <a
                              key={f.fileKey}
                              href={`/api/kintone-file?fileKey=${encodeURIComponent(f.fileKey)}`}
                              download={f.name}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#3f4f5e] text-white text-xs font-bold rounded shadow-sm hover:bg-slate-700 hover:-translate-y-0.5 transition-all whitespace-nowrap"
                            >
                              ⬇ ダウンロード {files.length > 1 ? i + 1 : ""}
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
        )}
      </div>
    </div>
  );
}
