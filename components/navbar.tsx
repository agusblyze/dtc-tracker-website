"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Track, TrackId } from "@/lib/tracks";
import { calculateProgress } from "@/lib/tracks";

interface NavBarProps {
  tracks: Record<TrackId, Track>;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

const TAB_ORDER = [
  "summary",
  "engineering",
  "marketing",
  "retention",
  "commercial",
  "operations",
];

const TAB_LABELS: Record<string, string> = {
  summary: "Summary",
  engineering: "Engineering",
  marketing: "Marketing",
  retention: "Retention",
  commercial: "Commercial",
  operations: "Operations",
};

export function NavBar({
  tracks,
  activeTab,
  onTabChange,
  isAdmin = false,
}: NavBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-[var(--font-space-grotesk)] text-lg font-semibold tracking-tight">
              OneSkin
            </span>
            <span className="text-[var(--foreground-muted)] text-sm">
              Data Analytics Roadmap
            </span>
            {isAdmin && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[var(--accent)]/20 text-[var(--accent)] rounded">
                Admin
              </span>
            )}
          </div>

          {/* Admin/View Toggle */}
          <Link
            href={isAdmin ? "/" : "/admin"}
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {isAdmin ? "View Mode" : "Edit"}
          </Link>
        </div>

        {/* Tabs */}
        <nav className="flex gap-1 -mb-px overflow-x-auto pb-px">
          {TAB_ORDER.map((tab) => {
            const isActive = activeTab === tab;
            const track = tab !== "summary" ? tracks[tab as TrackId] : null;
            const progress = track ? calculateProgress(track) : null;

            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`
                  relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors
                  ${
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {TAB_LABELS[tab]}
                  {progress !== null && (
                    <span
                      className={`
                        text-xs px-1.5 py-0.5 rounded font-mono
                        ${
                          isActive
                            ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                            : "bg-[var(--border)] text-[var(--foreground-muted)]"
                        }
                      `}
                    >
                      {progress}%
                    </span>
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
