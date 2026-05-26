import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { TracksData } from "@/lib/tracks";

const dataPath = path.join(process.cwd(), "data", "tracks.json");

export async function GET() {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const tracks: TracksData = JSON.parse(data);
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("Error reading tracks:", error);
    return NextResponse.json(
      { error: "Failed to load tracks data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const tracks: TracksData = await request.json();
    await fs.writeFile(dataPath, JSON.stringify(tracks, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving tracks:", error);
    return NextResponse.json(
      { error: "Failed to save tracks data" },
      { status: 500 }
    );
  }
}
