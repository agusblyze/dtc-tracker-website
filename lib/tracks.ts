export interface Milestone {
  key: string;
  label: string;
}

export interface Stage {
  num: string;
  name: string;
  description: string;
  milestones: string[];
}

export interface Track {
  id: string;
  label: string;
  currentStage: number;
  partialDone: Record<string, boolean>;
  stages: Stage[];
}

export interface TracksData {
  engineering: Track;
  marketing: Track;
  retention: Track;
  commercial: Track;
  operations: Track;
}

export type TrackId = keyof TracksData;

export const TRACK_IDS: TrackId[] = [
  "engineering",
  "marketing",
  "retention",
  "commercial",
  "operations",
];

export function getMilestoneKey(stageNum: string, milestoneIndex: number): string {
  return `${stageNum}-${milestoneIndex}`;
}

export function isMilestoneComplete(
  track: Track,
  stageNum: string,
  milestoneIndex: number
): boolean {
  const stageIndex = track.stages.findIndex((s) => s.num === stageNum);
  const currentStageIndex = track.currentStage - 1;

  // If the stage is before the current stage, all milestones are complete
  if (stageIndex < currentStageIndex) {
    return true;
  }

  // If the stage is after the current stage, no milestones are complete
  if (stageIndex > currentStageIndex) {
    return false;
  }

  // For the current stage, check the partialDone map
  const key = getMilestoneKey(stageNum, milestoneIndex);
  return track.partialDone[key] === true;
}

export function calculateProgress(track: Track): number {
  const totalStages = track.stages.length;
  if (totalStages === 0) return 0;

  // Base progress from completed stages
  const completedStages = Math.max(0, track.currentStage - 1);
  const baseProgress = (completedStages / totalStages) * 100;

  // Add partial progress from current stage
  const currentStageData = track.stages[track.currentStage - 1];
  if (currentStageData) {
    const totalMilestones = currentStageData.milestones.length;
    if (totalMilestones > 0) {
      const completedMilestones = currentStageData.milestones.filter(
        (_, idx) =>
          track.partialDone[getMilestoneKey(currentStageData.num, idx)] === true
      ).length;
      const partialProgress =
        (completedMilestones / totalMilestones / totalStages) * 100;
      return Math.round(baseProgress + partialProgress);
    }
  }

  return Math.round(baseProgress);
}
