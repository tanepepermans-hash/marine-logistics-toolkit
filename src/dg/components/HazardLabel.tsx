"use client";

import { useId } from "react";
import { getDgClass } from "@/dg/data/classes";
import type { DgClassId, SymbolKey } from "@/dg/types";

// -----------------------------------------------------------------------
// HazardLabel — an accurate, clean educational rendering of a Dangerous
// Goods hazard diamond: correct background color scheme, correct pictogram
// structure, and the correct class number placement for each of the 9 UN
// hazard classes and their divisions. These are original, simplified
// illustrations built to teach the standard label *structure* — they are
// not reproductions of official printed labels.
// -----------------------------------------------------------------------

const DIAMOND = "50,4 96,50 50,96 4,50";
const TOP_HALF = "50,4 96,50 4,50";
const BOTTOM_HALF = "4,50 96,50 50,96";

function isDark(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

function Pictogram({ symbol, fg }: { symbol: SymbolKey; fg: string }) {
  switch (symbol) {
    case "flame":
    case "flame-stripes":
    case "flame-split":
      return (
        <path
          d="M50 16 C41 26 36 34 37 42 C38 50 44 55 50 55 C56 55 62 50 63 42 C64 36 61 31 58 28 C58 33 55 36 52 36 C55 30 53 22 50 16 Z"
          fill={fg}
        />
      );
    case "flame-blue":
      return (
        <path
          d="M50 16 C41 26 36 34 37 42 C38 50 44 55 50 55 C56 55 62 50 63 42 C64 36 61 31 58 28 C58 33 55 36 52 36 C55 30 53 22 50 16 Z"
          fill="#ffffff"
        />
      );
    case "explosive":
      return (
        <g fill="#111111">
          <circle cx="50" cy="40" r="9" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x1 = 50 + Math.cos(angle) * 12;
            const y1 = 40 + Math.sin(angle) * 12;
            const x2 = 50 + Math.cos(angle) * 21;
            const y2 = 40 + Math.sin(angle) * 21;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111111" strokeWidth="3" strokeLinecap="round" />;
          })}
        </g>
      );
    case "gas-cylinder":
      return (
        <g fill="none" stroke={fg} strokeWidth="3">
          <rect x="40" y="22" width="20" height="32" rx="5" />
          <rect x="46" y="14" width="8" height="10" rx="2" />
          <line x1="40" y1="34" x2="60" y2="34" />
        </g>
      );
    case "skull":
      return (
        <g fill={fg}>
          <circle cx="50" cy="34" r="13" />
          <rect x="43" y="42" width="14" height="8" rx="2" />
          <circle cx="45" cy="32" r="3" fill="white" />
          <circle cx="55" cy="32" r="3" fill="white" />
          <path d="M48 40 L50 44 L52 40 Z" fill="white" />
          <g stroke={fg} strokeWidth="3" strokeLinecap="round">
            <line x1="34" y1="56" x2="50" y2="66" />
            <line x1="50" y1="56" x2="34" y2="66" />
            <line x1="66" y1="56" x2="50" y2="66" />
            <line x1="50" y1="56" x2="66" y2="66" />
          </g>
        </g>
      );
    case "oxidizer":
    case "organic-peroxide":
      return (
        <g>
          <circle cx="50" cy="46" r="15" fill="none" stroke={fg} strokeWidth="6" />
          <path
            d="M50 14 C43 22 39 29 40 35 C41 41 45 44 50 44 C55 44 59 41 60 35 C61 30 58 26 56 24 C56 28 54 30 52 30 C54 25 52 19 50 14 Z"
            fill={fg}
          />
        </g>
      );
    case "infectious":
      return (
        <g fill="none" stroke={fg} strokeWidth="3">
          <circle cx="50" cy="30" r="9" />
          <circle cx="38" cy="48" r="9" />
          <circle cx="62" cy="48" r="9" />
          <circle cx="50" cy="39" r="4" fill={fg} stroke="none" />
        </g>
      );
    case "radioactive":
      return (
        <g fill="#111111">
          <circle cx="50" cy="38" r="6" />
          {[0, 120, 240].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 50 38)`}>
              <path d="M50 38 L44 20 A18 18 0 0 1 56 20 Z" />
            </g>
          ))}
          <circle cx="50" cy="38" r="15" fill="none" stroke="#111111" strokeWidth="2" />
        </g>
      );
    case "corrosive":
      return (
        <g>
          <g fill="none" stroke={fg} strokeWidth="3">
            <path d="M38 14 L34 26 L42 26 Z" />
            <path d="M58 10 L53 24 L63 24 Z" />
          </g>
          <g fill={fg}>
            <circle cx="38" cy="32" r="2.5" />
            <circle cx="38" cy="38" r="2" />
            <circle cx="58" cy="30" r="2.5" />
            <circle cx="58" cy="37" r="2" />
          </g>
          <path d="M28 46 Q30 40 38 40 Q46 40 46 48 Q46 56 36 56 Q28 56 28 46 Z" fill={fg} />
          <rect x="52" y="44" width="20" height="9" rx="1.5" fill={fg} />
        </g>
      );
    case "misc-stripes":
    default:
      return null;
  }
}

function StripeBackground({ symbol, fg, clipId }: { symbol: SymbolKey; fg: string; clipId: string }) {
  if (symbol === "flame-stripes") {
    const cols = 7;
    const width = 100 / cols;
    return (
      <g clipPath={`url(#${clipId})`}>
        {Array.from({ length: cols }).map((_, i) => (
          <rect key={i} x={i * width} y={0} width={width} height={100} fill={i % 2 === 0 ? fg : "#ffffff"} />
        ))}
      </g>
    );
  }
  if (symbol === "misc-stripes") {
    const cols = 7;
    const width = 100 / cols;
    return (
      <g clipPath={`url(#${clipId}-top)`}>
        {Array.from({ length: cols }).map((_, i) => (
          <rect key={i} x={i * width} y={0} width={width} height={50} fill={i % 2 === 0 ? "#111111" : "#ffffff"} />
        ))}
      </g>
    );
  }
  return null;
}

interface HazardLabelProps {
  classId: DgClassId;
  size?: number;
  showCaption?: boolean;
  className?: string;
}

export default function HazardLabel({ classId, size = 140, showCaption = false, className = "" }: HazardLabelProps) {
  const dgClass = getDgClass(classId);
  const rawId = useId();
  const clipId = `dg-clip-${rawId}`;
  const { bg, bg2, fg, symbol, labelNumberText } = dgClass;
  const numberColor = isDark(bg2 ?? bg) ? "#ffffff" : "#111111";
  const fontSize = labelNumberText.length > 2 ? 20 : 26;

  return (
    <div className={`inline-flex flex-col items-center gap-2 ${className}`} style={{ width: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={`${dgClass.id} ${dgClass.name} hazard label`}>
        <defs>
          <clipPath id={clipId}>
            <polygon points={DIAMOND} />
          </clipPath>
          <clipPath id={`${clipId}-top`}>
            <polygon points={TOP_HALF} />
          </clipPath>
          <clipPath id={`${clipId}-bottom`}>
            <polygon points={BOTTOM_HALF} />
          </clipPath>
        </defs>

        {/* base background */}
        {bg2 ? (
          <>
            <polygon points={TOP_HALF} fill={bg} />
            <polygon points={BOTTOM_HALF} fill={bg2} />
          </>
        ) : (
          <polygon points={DIAMOND} fill={bg} />
        )}

        <StripeBackground symbol={symbol} fg={fg} clipId={clipId} />

        {/* pictogram, clipped to stay inside the diamond */}
        <g clipPath={`url(#${clipId})`}>
          <Pictogram symbol={symbol} fg={fg} />
        </g>

        {/* class / division number */}
        <text
          x="50"
          y="80"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill={numberColor}
          fontFamily="system-ui, sans-serif"
        >
          {labelNumberText}
        </text>

        {/* diamond border on top */}
        <polygon points={DIAMOND} fill="none" stroke="#111111" strokeWidth="2.5" />
      </svg>
      {showCaption && (
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-mist-300">Class {dgClass.id}</div>
          <div className="text-sm font-semibold text-white">{dgClass.name}</div>
        </div>
      )}
    </div>
  );
}
