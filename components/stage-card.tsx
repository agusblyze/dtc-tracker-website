import type { Track } from "@/lib/tracks";
import { isMilestoneComplete, getMilestoneKey } from "@/lib/tracks";

interface StageCardProps {
  track: Track;
  stageIndex: number;
  isAdmin?: boolean;
  onMilestoneToggle?: (stageNum: string, milestoneIndex: number) => void;
}

export function StageCard({
  track,
  stageIndex,
  isAdmin = false,
  onMilestoneToggle,
}: StageCardProps) {
  const stage = track.stages[stageIndex];
  const currentStageIndex = track.currentStage - 1;

  const isComplete = stageIndex < currentStageIndex;
  const isCurrent = stageIndex === currentStageIndex;
  const isUpcoming = stageIndex > currentStageIndex;

  const statusColor = isComplete
    ? "var(--success)"
    : isCurrent
      ? "var(--accent)"
      : "var(--foreground-muted)";

  const statusLabel = isComplete
    ? "Complete"
    : isCurrent
      ? "In Progress"
      : "Upcoming";

  return (
    <div
      className={`
        relative p-6 rounded-xl border transition-all
        ${
          isCurrent
            ? "bg-[var(--background-card)] border-[var(--accent)]/50 shadow-lg shadow-[var(--accent)]/5"
            : "bg-[var(--background-card)]/50 border-[var(--border)]"
        }
        ${isUpcoming ? "opacity-60" : ""}
      `}
    >
      {/* Stage Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center w-10 h-10 rounded-lg font-mono text-sm font-bold"
            style={{
              backgroundColor: `color-mix(in srgb, ${statusColor} 20%, transparent)`,
              color: statusColor,
            }}
          >
            {stage.num}
          </span>
          <div>
            <h3 className="font-[var(--font-space-grotesk)] font-semibold text-lg">
              {stage.name}
            </h3>
            <p className="text-sm text-[var(--foreground-muted)]">
              {stage.description}
            </p>
          </div>
        </div>
        <span
          className="text-xs font-medium px-2 py-1 rounded"
          style={{
            backgroundColor: `color-mix(in srgb, ${statusColor} 20%, transparent)`,
            color: statusColor,
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Milestones */}
      <div className="space-y-2 mt-4">
        {stage.milestones.map((milestone, idx) => {
          const isChecked = isMilestoneComplete(track, stage.num, idx);
          const canToggle = isAdmin && isCurrent;

          return (
            <div
              key={idx}
              className={`
                flex items-start gap-3 p-3 rounded-lg transition-colors
                ${canToggle ? "hover:bg-[var(--border)]/30 cursor-pointer" : ""}
              `}
              onClick={() => canToggle && onMilestoneToggle?.(stage.num, idx)}
            >
              {/* Checkbox */}
              <div
                className={`
                  flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-all
                  ${
                    isChecked
                      ? "bg-[var(--success)] border-[var(--success)]"
                      : isCurrent
                        ? "border-[var(--accent)]"
                        : "border-[var(--border)]"
                  }
                `}
              >
                {isChecked && (
                  <svg
                    className="w-3 h-3 text-[var(--background)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>

              {/* Milestone Text */}
              <span
                className={`
                  text-sm leading-relaxed
                  ${isChecked ? "text-[var(--foreground-muted)] line-through" : ""}
                `}
              >
                {milestone}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress indicator for current stage */}
      {isCurrent && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--foreground-muted)]">
              Stage Progress
            </span>
            <span className="font-mono text-[var(--accent)]">
              {
                stage.milestones.filter((_, idx) =>
                  isMilestoneComplete(track, stage.num, idx)
                ).length
              }{" "}
              / {stage.milestones.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
