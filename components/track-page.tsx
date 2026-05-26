import type { Track } from "@/lib/tracks";
import { ProgressBar } from "./progress-bar";
import { StageCard } from "./stage-card";

interface TrackPageProps {
  track: Track;
  isAdmin?: boolean;
  onMilestoneToggle?: (stageNum: string, milestoneIndex: number) => void;
  onStageChange?: (newStage: number) => void;
}

export function TrackPage({
  track,
  isAdmin = false,
  onMilestoneToggle,
  onStageChange,
}: TrackPageProps) {
  return (
    <div className="space-y-8">
      {/* Track Header */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-[var(--font-space-grotesk)] font-bold tracking-tight">
          {track.label}
        </h1>
        <ProgressBar track={track} />

        {/* Admin Stage Selector */}
        {isAdmin && onStageChange && (
          <div className="flex items-center gap-4 p-4 bg-[var(--background-card)] rounded-xl border border-[var(--border)]">
            <label className="text-sm text-[var(--foreground-muted)]">
              Current Stage:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  track.currentStage > 1 &&
                  onStageChange(track.currentStage - 1)
                }
                disabled={track.currentStage <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--border)] hover:bg-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="w-12 text-center font-mono text-lg font-bold text-[var(--accent)]">
                {track.currentStage}
              </span>
              <button
                onClick={() =>
                  track.currentStage < track.stages.length &&
                  onStageChange(track.currentStage + 1)
                }
                disabled={track.currentStage >= track.stages.length}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--border)] hover:bg-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <span className="text-sm text-[var(--foreground-muted)]">
              of {track.stages.length} stages
            </span>
          </div>
        )}
      </div>

      {/* Stages Grid */}
      <div className="space-y-6">
        {track.stages.map((stage, idx) => (
          <StageCard
            key={stage.num}
            track={track}
            stageIndex={idx}
            isAdmin={isAdmin}
            onMilestoneToggle={onMilestoneToggle}
          />
        ))}
      </div>
    </div>
  );
}
