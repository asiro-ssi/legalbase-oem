"use client";

import { useState } from "react";

export default function LinksTable({ records }: { records: Record<string, unknown>[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("すべて");

  const publishedRecords = records.filter((r) => {
    const val = (r["代理店ページ公開"] as { value?: string } | undefined)?.value;
    return val && val.toLowerCase().trim() === "on";
  });

  const categories = ["すべて", ...Array.from(new Set(
    publishedRecords
      .map((r) => (r.category as { value?: string } | undefined)?.value)
      .filter((v): v is string => !!v)
  ))];

  const filteredRecords = activeFilter === "すべて"
    ? publishedRecords
    : publishedRecords.filter((r) => (r.category as { value?: string } | undefined)?.value === activeFilter);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        {categories.map((cat) => (
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
        {filteredRecords.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 text-center">該当するリンクがありません。</div>
        ) : (
          <table className="w-full text-left border-collapse bg-white">
            <thead className="bg-[#3f4f5e] text-white sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold whitespace-nowrap w-40">カテゴリ</th>
                <th className="px-6 py-3 text-xs font-semibold">タイトル / 説明</th>
                <th className="px-6 py-3 text-xs font-semibold whitespace-nowrap w-40 text-right">リンク</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.map((record) => {
                const cat = (record.category as { value?: string } | undefined)?.value ?? "未分類";
                const title = (record.Title as { value?: string } | undefined)?.value ?? "(タイトルなし)";
                const desc = (record.Description as { value?: string } | undefined)?.value ?? "";
                const url = (record["リンク"] as { value?: string } | undefined)?.value ?? "";
                const id = (record["レコード番号"] as { value?: string } | undefined)?.value;

                return (
                  <tr key={id ?? Math.random()} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {cat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      <div className="font-bold group-hover:text-blue-600 transition-colors">{title}</div>
                      {desc && <div className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{desc}</div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {url ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-4 py-2 bg-[#3f4f5e] text-white text-xs font-bold rounded shadow-sm hover:bg-slate-700 hover:-translate-y-0.5 transition-all whitespace-nowrap"
                        >
                          開く ↗
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">URLなし</span>
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
