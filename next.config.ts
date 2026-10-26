import type { NextConfig } from "next";

/**
 * このサイトは bonobo（asiro-ssi.com）へ移管済み。
 * どのページへのアクセスも、パスを維持したまま移管後の URL へ恒久リダイレクトする。
 *   /legiew 配下 → https://asiro-ssi.com/legiew/...
 *   それ以外     → https://legalbase.legal-protect.net/oem/...
 * 上から順に評価されるため、LEGIEW を先に書く。
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/legiew/:path*",
        destination: "https://asiro-ssi.com/legiew/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        destination: "https://legalbase.legal-protect.net/oem/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
