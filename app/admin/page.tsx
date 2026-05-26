"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import type { TracksData, TrackId, Track } from "@/lib/tracks";
import { getMilestoneKey } from "@/lib/tracks";
import { NavBar } from "@/components/navbar";
import { SummaryPage } from "@/components/summary-page";
import { TrackPage } from "@/components/track-page";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>("summary");
  const [saving, setSaving] = useState(false);

  const { data: tracks, error, isLoading, mutate } = useSWR<TracksData>(
    "/api/tracks",
    fetcher
  );

  const updateTrack = useCallback(
    async (trackId: TrackId, updates: Partial<Track>) => {
      if (!tracks) return;

      // Optimistically update the UI
      const optimisticData = {
        ...tracks,
        [trackId]: {
          ...tracks[trackId],
          ...updates,
        },
      };

      setSaving(true);

      try {
        await mutate(
          async () => {
            const response = await fetch(`/api/tracks/${trackId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updates),
            });

            if (!response.ok) {
              throw new Error("Failed to update track");
            }

            return optimisticData;
          },
          {
            optimisticData,
            rollbackOnError: true,
          }
        );
      } catch (err) {
        console.error("Failed to update track:", err);
      } finally {
        setSaving(false);
      }
    },
    [tracks, mutate]
  );

  const handleStageChange = useCallback(
    (trackId: TrackId, newStage: number) => {
      if (!tracks) return;

      // When changing stages, reset the partialDone for the new current stage
      const track = tracks[trackId];
      const newPartialDone: Record<string, boolean> = {};

      // Keep completed milestones from past stages
      track.stages.forEach((stage, idx) => {
        if (idx < newStage - 1) {
          // All milestones in completed stages stay complete
          stage.milestones.forEach((_, mIdx) => {
            newPartialDone[getMilestoneKey(stage.num, mIdx)] = true;
          });
        }
      });

      updateTrack(trackId, {
        currentStage: newStage,
        partialDone: newPartialDone,
      });
    },
    [tracks, updateTrack]
  );

  const handleMilestoneToggle = useCallback(
    (trackId: TrackId, stageNum: string, milestoneIndex: number) => {
      if (!tracks) return;

      const track = tracks[trackId];
      const key = getMilestoneKey(stageNum, milestoneIndex);
      const newPartialDone = {
        ...track.partialDone,
        [key]: !track.partialDone[key],
      };

      updateTrack(trackId, { partialDone: newPartialDone });
    },
    [tracks, updateTrack]
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
        isAdmin={true}
      />

      {/* Saving indicator */}
      {saving && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2 bg-[var(--accent)] text-[var(--background)] rounded-lg text-sm font-medium shadow-lg">
          Saving...
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "summary" ? (
          <SummaryPage
            tracks={tracks}
            onSelectTrack={(trackId) => setActiveTab(trackId)}
          />
        ) : (
          <TrackPage
            track={tracks[activeTab as TrackId]}
            isAdmin={true}
            onStageChange={(newStage) =>
              handleStageChange(activeTab as TrackId, newStage)
            }
            onMilestoneToggle={(stageNum, milestoneIndex) =>
              handleMilestoneToggle(activeTab as TrackId, stageNum, milestoneIndex)
            }
          />
        )}
      </main>
    </div>
  );
}
