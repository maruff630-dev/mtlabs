import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Scale map for quality tiers (Real-ESRGAN uses integer scale)
const SCALE_MAP: Record<string, number> = {
  HD:  2,
  "2K": 3,
  "4K": 4,
};

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, quality } = await req.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "videoUrl is required" }, { status: 400 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json({ error: "Replicate API token not configured" }, { status: 500 });
    }

    const scale = SCALE_MAP[quality] ?? 2;

    // lucataco/real-esrgan-video — free-tier compatible, real video upscaling
    const output = await replicate.run(
      "lucataco/real-esrgan-video:9f2a5952e89b7c22434fa4a66497d02b4a63d7439a70d4c36a6a08068e9fc6f8",
      {
        input: {
          video_path: videoUrl,
          scale,
        },
      }
    );

    const outputUrl = typeof output === "string" ? output : (output as any)?.url?.() || String(output);

    return NextResponse.json({ url: outputUrl, quality, scale });
  } catch (err: any) {
    console.error("Real-ESRGAN Video error:", err);
    return NextResponse.json({ error: err.message || "Video upscaling failed" }, { status: 500 });
  }
}
