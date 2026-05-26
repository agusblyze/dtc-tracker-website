import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { TracksData, TrackId, Track } from "@/lib/tracks";

const dataPath = path.join(process.cwd(), "data", "tracks.json");

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ trackId: string }> }
) {
  try {
    const { trackId } = await params;
    const updates: Partial<Track> = await request.json();

    const data = await fs.readFile(dataPath, "utf-8");
    const tracks: TracksData = JSON.parse(data);

    if (!(trackId in tracks)) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const track = tracks[trackId as TrackId];

    // Update only allowed fields
    if (updates.currentStage !== undefined) {
      track.currentStage = updates.currentStage;
    }
    if (updates.partialDone !== undefined) {
      track.partialDone = updates.partialDone;
    }

    await fs.writeFile(dataPath, JSON.stringify(tracks, null, 2));

    return NextResponse.json({ success: true, track });
  } catch (error) {
    console.error("Error updating track:", error);
    return NextResponse.json(
      { error: "Failed to update track" },
      { status: 500 }
    );
  }
}
