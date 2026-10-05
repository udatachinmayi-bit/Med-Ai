import { useId } from "react";
import type { CSSProperties } from "react";

export interface HexagonPatternProps {
  className?: string;
  /** Side-to-side width of one hexagon, in SVG units. */
  size?: number;
  opacity?: number;
  color?: string;
}

/** A subtle SVG honeycomb texture intended as a non-interactive background layer. */
export function HexagonPattern({
  className = "",
  size = 56,
  opacity = 0.1,
  color = "#0284c7",
}: HexagonPatternProps) {
  const id = useId().replace(/:/g, "");
  const patternId = `medical-hexagon-pattern-${id}`;
  const height = Math.round(size * 0.866);
  const points = `${size * 0.25},0 ${size * 0.75},0 ${size},${height / 2} ${size * 0.75},${height} ${size * 0.25},${height} 0,${height / 2}`;
  const style = {
    "--hex-color": color,
    "--hex-opacity": opacity,
  } as CSSProperties;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`.trim()}
      preserveAspectRatio="xMidYMid slice"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={patternId} width={size * 1.5} height={height} patternUnits="userSpaceOnUse">
          <polygon
            fill="none"
            points={points}
            stroke="var(--hex-color)"
            strokeOpacity="var(--hex-opacity)"
            strokeWidth="1"
          />
          <polygon
            fill="none"
            points={points}
            stroke="var(--hex-color)"
            strokeOpacity="var(--hex-opacity)"
            strokeWidth="1"
            transform={`translate(${size * 0.75} ${height / 2})`}
          />
        </pattern>
      </defs>
      <rect fill={`url(#${patternId})`} height="100%" width="100%" />
    </svg>
  );
}

export default HexagonPattern;
