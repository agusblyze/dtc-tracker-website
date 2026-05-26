import type { Track, TrackId } from "@/lib/tracks";
import { calculateProgress } from "@/lib/tracks";
import { ProgressBar } from "./progress-bar";

interface SummaryPageProps {
  tracks: Record<TrackId, Track>;
  onSelectTrack: (trackId: TrackId) => void;
}

const TRACK_DESCRIPTIONS: Record<TrackId, string> = {
  engineering: "Core data infrastructure, tracking, and analytics platform",
  marketing: "Attribution, measurement, and campaign optimization",
  retention: "Customer lifecycle, LTV, and repeat purchase analytics",
  commercial: "Executive reporting, forecasting, and strategic analytics",
  operations: "Fulfillment, inventory, and supply chain intelligence",
};

export function SummaryPage({ tracks, onSelectTrack }: SummaryPageProps) {
  const trackIds: TrackId[] = [
    "engineering",
    "marketing",
    "retention",
    "commercial",
    "operations",
  ];

  const overallProgress = Math.round(
    trackIds.reduce((sum, id) => sum + calculateProgress(tracks[id]), 0) /
      trackIds.length
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-[var(--font-space-grotesk)] font-bold tracking-tight">
          Data Analytics Maturity
        </h1>
        <p className="text-[var(--foreground-muted)] max-w-2xl mx-auto">
          Track progress across five key areas to build a world-class data
          analytics capability.
        </p>

        {/* Overall Progress */}
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-[var(--background-card)] rounded-xl border border-[var(--border)]">
          <span className="text-[var(--foreground-muted)]">
            Overall Progress
          </span>
          <span className="text-2xl font-mono font-bold text-[var(--accent)]">
            {overallProgress}%
          </span>
        </div>
      </div>

      {/* Track Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trackIds.map((trackId) => {
          const track = tracks[trackId];
          const progress = calculateProgress(track);
          const currentStage = track.stages[track.currentStage - 1];

          return (
            <button
              key={trackId}
              onClick={() => onSelectTrack(trackId)}
              className="text-left p-6 bg-[var(--background-card)] rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all group"
            >
              {/* Track Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-[var(--font-space-grotesk)] font-semibold text-lg group-hover:text-[var(--accent)] transition-colors">
                    {track.label}
                  </h3>
                  <p className="text-sm text-[var(--foreground-muted)] mt-1">
                    {TRACK_DESCRIPTIONS[trackId]}
                  </p>
                </div>
                <span className="text-xl font-mono font-bold text-[var(--accent)]">
                  {progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <ProgressBar track={track} showLabel={false} size="sm" />

              {/* Current Stage */}
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] rounded">
                    Stage {track.currentStage}
                  </span>
                  <span className="text-sm text-[var(--foreground-muted)] truncate">
                    {currentStage?.name}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-[var(--foreground-muted)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--border)]" />
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  );
}
