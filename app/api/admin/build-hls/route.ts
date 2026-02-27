import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const projectId = body?.projectId as string;

  if (!projectId) {
    return NextResponse.json({ ok: false, error: "projectId required" }, { status: 400 });
  }

  const cloudRunUrl = process.env.CLOUD_RUN_HLS_BUILDER_URL;
  const secret = process.env.BUILD_SECRET;

  if (!cloudRunUrl || !secret) {
    return NextResponse.json(
      { ok: false, error: "Server env missing CLOUD_RUN_HLS_BUILDER_URL or BUILD_SECRET" },
      { status: 500 }
    );
  }

  const r = await fetch(`${cloudRunUrl}/build`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-build-secret": secret,
    },
    body: JSON.stringify({ projectId }),
  });

  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}