// Blyze Labs Design System Colors
export const C = {
  bgDark: "#1a1a1a",
  bgCard: "#242424",
  paper: "#f5f0eb",
  ink: "#1a1a1a",
  muted: "#8a8a8a",
  electricBlue: "#00d4ff",
  electricBlueAlt: "#00bfff",
  accent: "#00d4ff",
  border: "#333333",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#f87171",
};

// Font families (configured in layout.tsx via next/font)
export const F = {
  display: "var(--font-space-grotesk)",
  ui: "var(--font-inter-tight)",
  mono: "var(--font-jetbrains-mono)",
};

// Status colors for stages
export const STATUS_COLORS = {
  done: C.success,
  current: C.electricBlue,
  upcoming: C.muted,
};
