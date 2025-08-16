import React from "react";
import type { SceneTheme } from "../types/profile";

export function textureStyle(theme: SceneTheme) {
  const t = theme?.texture ?? 'none';

  const patterns: Record<string, string> = {
    none: "none",
    diagonal:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 6px)",
    dots:
      "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
    grid:
      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    paper:
      "radial-gradient(rgba(255,255,255,0.03) 1px, rgba(0,0,0,0.02) 2px, transparent 3px)",
  };

  let bgImage = patterns[t] || "none";
  let extra = {};

  if (t === "dots") {
    extra = { backgroundSize: "12px 12px, 6px 6px" };
  } else if (t === "grid") {
    extra = { backgroundSize: "24px 24px, 24px 24px" };
  }

  return { backgroundImage: bgImage, ...extra };
}

export function ThemeCSSVars({ theme }: { theme: SceneTheme }) {
  const style = {
    ["--profile-accent" as any]: theme?.accentColor ?? "#F59E0B",
    ["--profile-secondary" as any]: theme?.secondaryColor ?? "#34D399",
    ["--profile-text" as any]: theme?.textColor ?? "#F5F7F7",
    ["--profile-card" as any]: theme?.cardColor ?? "#13171A",
    ["--profile-overlay" as any]: String(theme?.backgroundOpacity ?? 0.9),
  } as React.CSSProperties;

  return <div style={style} />;
}
