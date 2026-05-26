import type { Track } from "@/lib/tracks";

interface ProgressBarProps {
  track: Track;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  track,
  showLabel = true,
  size = "md",
}: ProgressBarProps) {
  const totalStages = track.stages.length;
  const currentStageIndex = track.currentStage - 1;

  // Calculate completed milestones in current stage
  const currentStage = track.stages[currentStageIndex];
  const completedMilestones = currentStage
    ? currentStage.milestones.filter(
        (_, idx) => track.partialDone[`${currentStage.num}-${idx}`] === true
      ).length
    : 0;
  const totalMilestones = currentStage?.milestones.length || 0;

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-[var(--foreground-muted)]">Progress</span>
          <span className="font-mono text-[var(--accent)]">
            Stage {track.currentStage} / {totalStages}
            {totalMilestones > 0 && (
              <span className="text-[var(--foreground-muted)] ml-2">
                ({completedMilestones}/{totalMilestones} milestones)
              </span>
            )}
          </span>
        </div>
      )}
      <div
        className={`w-full ${heights[size]} bg-[var(--border)] rounded-full overflow-hidden`}
      >
        <div className="h-full flex">
          {track.stages.map((stage, idx) => {
            const isComplete = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const stageWidth = 100 / totalStages;

            let fillWidth = 0;
            if (isComplete) {
              fillWidth = 100;
            } else if (isCurrent && totalMilestones > 0) {
              fillWidth = (completedMilestones / totalMilestones) * 100;
            }

            return (
              <div
                key={stage.num}
                className="relative h-full"
                style={{ width: `${stageWidth}%` }}
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isComplete
                      ? "bg-[var(--success)]"
                      : isCurrent
                        ? "bg-[var(--accent)]"
                        : "bg-transparent"
                  }`}
                  style={{ width: `${fillWidth}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
