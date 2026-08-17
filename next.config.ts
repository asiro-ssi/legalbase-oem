import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 全レスポンスに noindex を付ける。
        // app/layout.tsx の metadata.robots は HTML にしか効かないため、
        // /api/kintone-file が返す PDF などもここでカバーする
        // （PDF 自体には meta タグを埋め込めない）。
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noimageindex",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
