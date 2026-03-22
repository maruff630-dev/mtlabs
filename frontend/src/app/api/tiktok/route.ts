import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

    // Step 1: Get metadata via TikTok's official oEmbed
    const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`);
    const oembed = oembedRes.ok ? await oembedRes.json() : {};

    // Step 2: Get download URL via tikwm.com (free, no watermark)
    const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
    const tikwm = tikwmRes.ok ? await tikwmRes.json() : {};

    const videoData = tikwm?.data;
    const downloadUrl = videoData?.hdplay || videoData?.play || null;
    const thumbnail = oembed?.thumbnail_url || videoData?.cover || videoData?.origin_cover || null;

    return NextResponse.json({
      title: oembed?.title || videoData?.title || "TikTok Video",
      author: oembed?.author_name || videoData?.author?.nickname || "TikTok",
      thumbnail,
      downloadUrl,
      duration: videoData?.duration || null,
      width: videoData?.width || null,
      height: videoData?.height || null,
    });
  } catch (err: any) {
    console.error("TikTok API error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch TikTok data" }, { status: 500 });
  }
}
