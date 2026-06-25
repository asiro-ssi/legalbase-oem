import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileKey = searchParams.get("fileKey");
  if (!fileKey) {
    return new NextResponse("Missing fileKey", { status: 400 });
  }

  const kintoneUrl = `${process.env.KINTONE_BASE_URL}/k/v1/file.json?fileKey=${fileKey}`;

  try {
    const res = await fetch(kintoneUrl, {
      method: "GET",
      headers: {
        "X-Cybozu-API-Token": process.env.KINTONE_APP226_TOKEN!,
      },
    });

    if (!res.ok) {
      return new NextResponse(`Kintone Error: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
