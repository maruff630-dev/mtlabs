import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Scale map for quality tiers
const SCALE_MAP: Record<string, number> = {
  HD: 2,
  "2K": 3,
  "4K": 4,
};

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, quality } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate API token not configured" }, { status: 500 });
    }

    const scale = SCALE_MAP[quality] ?? 2;

    // Real-ESRGAN — best for all types of images/thumbnails/video frames
    const output = await replicate.run(
      "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      {
        input: {
          image: imageUrl,
          scale,
          face_enhance: false,
        },
      }
    );

    const outputUrl = typeof output === "string" ? output : (output as any)?.url?.() || String(output);

    return NextResponse.json({ url: outputUrl, scale, quality });
  } catch (err: any) {
    console.error("Real-ESRGAN error:", err);
    return NextResponse.json({ error: err.message || "Upscaling failed" }, { status: 500 });
  }
}
