import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate API token not configured" }, { status: 500 });
    }

    // GFPGAN — best for face/photo enhancement
    const output = await replicate.run(
      "tencentarc/gfpgan:0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c",
      {
        input: {
          img: imageUrl,
          scale: 2,
          version: "v1.4",
        },
      }
    );

    // output is a URL string
    const outputUrl = typeof output === "string" ? output : (output as any)?.url?.() || String(output);

    return NextResponse.json({ url: outputUrl });
  } catch (err: any) {
    console.error("GFPGAN error:", err);
    return NextResponse.json({ error: err.message || "Upscaling failed" }, { status: 500 });
  }
}
