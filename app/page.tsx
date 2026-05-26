"use client";

import { useState } from "react";
import useSWR from "swr";
import type { TracksData, TrackId } from "@/lib/tracks";
import { NavBar } from "@/components/navbar";
import { SummaryPage } from "@/components/summary-page";
import { TrackPage } from "@/components/track-page";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<string>("summary");

  const { data: tracks, error, isLoading } = useSWR<TracksData>(
    "/api/tracks",
    fetcher
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[var(--foreground-muted)]">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !tracks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-[var(--danger)]">Failed to load roadmap data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-lg font-medium hover:bg-[var(--accent-hover)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar
        tracks={tracks}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "summary" ? (
          <SummaryPage
            tracks={tracks}
            onSelectTrack={(trackId) => setActiveTab(trackId)}
          />
        ) : (
          <TrackPage track={tracks[activeTab as TrackId]} />
        )}
      </main>
    </div>
  );
}
