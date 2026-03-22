import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Resolution map for quality tiers
const RESOLUTION_MAP: Record<string, string> = {
  HD:  "1080p",
  "2K": "2k",
  "4K": "4k",
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

    const targetResolution = RESOLUTION_MAP[quality] ?? "1080p";

    // Topaz Labs Video Upscale — real video upscaling with 4K + 60fps support
    const output = await replicate.run(
      "topazlabs/video-upscale",
      {
        input: {
          video: videoUrl,
          target_fps: 60,
          target_resolution: targetResolution,
        },
      }
    );

    const outputUrl = typeof output === "string" ? output : (output as any)?.url?.() || String(output);

    return NextResponse.json({ url: outputUrl, quality, resolution: targetResolution });
  } catch (err: any) {
    console.error("Topaz Video Upscale error:", err);
    return NextResponse.json({ error: err.message || "Video upscaling failed" }, { status: 500 });
  }
}
