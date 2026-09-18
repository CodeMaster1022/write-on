import { ITEM_ART } from "./inki-items";
import type { Equipped } from "@/lib/types";

type Mood = "happy" | "cheer" | "think";

interface InkiProps {
  size?: number;
  equipped?: Partial<Equipped>;
  mood?: Mood;
  /** Set for decorative instances that sit next to a heading saying the same thing. */
  decorative?: boolean;
  className?: string;
}

const BODY = "#5B4E8C";
const BODY_DARK = "#3E3462";

function Scene({ art, color }: { art: string; color: string }) {
  if (art === "night") {
    return (
      <g>
        <circle cx="100" cy="100" r="96" fill={color} />
        <circle cx="48" cy="44" r="2.6" fill="#FFF6DC" />
        <circle cx="152" cy="52" r="3.2" fill="#FFF6DC" />
        <circle cx="70" cy="22" r="2" fill="#FFF6DC" />
        <circle cx="168" cy="118" r="2.2" fill="#FFF6DC" />
        <circle cx="34" cy="132" r="2.4" fill="#FFF6DC" />
        <circle cx="132" cy="18" r="1.8" fill="#FFF6DC" />
      </g>
    );
  }

  if (art === "library") {
    return (
      <g>
        <circle cx="100" cy="100" r="96" fill={color} opacity="0.18" />
        <rect x="18" y="52" width="30" height="96" rx="4" fill={color} opacity="0.5" />
        <rect x="24" y="60" width="18" height="4" rx="2" fill="#FBF6EC" opacity="0.7" />
        <rect x="24" y="92" width="18" height="4" rx="2" fill="#FBF6EC" opacity="0.7" />
        <rect x="24" y="124" width="18" height="4" rx="2" fill="#FBF6EC" opacity="0.7" />
        <rect x="152" y="52" width="30" height="96" rx="4" fill={color} opacity="0.5" />
        <rect x="158" y="60" width="18" height="4" rx="2" fill="#FBF6EC" opacity="0.7" />
        <rect x="158" y="92" width="18" height="4" rx="2" fill="#FBF6EC" opacity="0.7" />
        <rect x="158" y="124" width="18" height="4" rx="2" fill="#FBF6EC" opacity="0.7" />
      </g>
    );
  }

  // reef
  return (
    <g>
      <circle cx="100" cy="100" r="96" fill={color} opacity="0.16" />
      <path
        d="M26 190c0-26 8-34 8-52 0-10-6-14-6-24 0-8 6-12 12-12s12 4 12 12c0 10-6 14-6 24 0 18 8 26 8 52"
        fill={color}
        opacity="0.45"
      />
      <path
        d="M152 190c0-22 7-30 7-46 0-9-5-13-5-21 0-7 5-11 11-11s11 4 11 11c0 8-5 12-5 21 0 16 7 24 7 46"
        fill={color}
        opacity="0.35"
      />
    </g>
  );
}

function Hat({ art, color }: { art: string; color: string }) {
  switch (art) {
    case "topHat":
      return (
        <g>
          <rect x="64" y="36" width="72" height="8" rx="4" fill={BODY_DARK} />
          <rect x="78" y="8" width="44" height="30" rx="4" fill={color} />
          <rect x="78" y="26" width="44" height="8" fill={BODY_DARK} />
        </g>
      );
    case "partyHat":
      return (
        <g>
          <path d="M100 2 122 40H78L100 2Z" fill={color} />
          <path d="M100 2 111 40H89L100 2Z" fill="#FFF6DC" opacity="0.5" />
          <circle cx="100" cy="4" r="6" fill="#E4577E" />
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M66 40 70 12l14 14 16-20 16 20 14-14 4 28H66Z" fill={color} />
          <rect x="66" y="36" width="68" height="8" rx="3" fill="#E8A21F" />
          <circle cx="100" cy="28" r="4" fill="#E4577E" />
        </g>
      );
    case "gradCap":
      return (
        <g>
          <path d="M100 8 152 28l-52 20-52-20 52-20Z" fill={color} />
          <path d="M100 34 74 24v14c0 6 12 10 26 10s26-4 26-10V24l-26 10Z" fill={BODY_DARK} />
          <path d="M150 28v22" stroke="#FFC95C" strokeWidth="3" strokeLinecap="round" />
          <circle cx="150" cy="52" r="5" fill="#FFC95C" />
        </g>
      );
    default:
      return null;
  }
}

function Neck({ art, color }: { art: string; color: string }) {
  switch (art) {
    case "scarf":
      return (
        <g>
          <path d="M66 124c10 8 24 12 34 12s24-4 34-12v14c-10 8-24 12-34 12s-24-4-34-12v-14Z" fill={color} />
          <path d="M120 140c6 12 8 22 6 32l-14-4c2-10 0-18-4-26l12-2Z" fill={color} />
          <path d="M70 130h64" stroke="#FBF6EC" strokeWidth="3" opacity="0.6" />
        </g>
      );
    case "medal":
      return (
        <g>
          <path d="M84 118l14 26M116 118l-14 26" stroke="#E4577E" strokeWidth="6" strokeLinecap="round" />
          <circle cx="100" cy="154" r="14" fill={color} />
          <circle cx="100" cy="154" r="8" fill="#E8A21F" />
          <path d="M100 148v12M95 154h10" stroke="#FFF6DC" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case "bowTie":
      return (
        <g>
          <path d="M100 130 76 118v24l24-12Z" fill={color} />
          <path d="M100 130 124 118v24l-24-12Z" fill={color} />
          <circle cx="100" cy="130" r="6" fill="#FBF6EC" />
        </g>
      );
    default:
      return null;
  }
}

function Held({ art, color }: { art: string; color: string }) {
  switch (art) {
    case "pencil":
      return (
        <g transform="rotate(20 166 112)">
          <rect x="160" y="74" width="12" height="52" rx="3" fill={color} />
          <path d="M160 126h12l-6 14-6-14Z" fill="#221D2E" />
          <rect x="160" y="68" width="12" height="8" rx="3" fill="#E4577E" />
        </g>
      );
    case "book":
      return (
        <g>
          <rect x="146" y="92" width="34" height="42" rx="4" fill={color} />
          <rect x="150" y="96" width="26" height="34" rx="2" fill="#FBF6EC" />
          <path d="M163 96v34" stroke={color} strokeWidth="2.4" />
          <path d="M154 104h6M154 112h6M168 104h6M168 112h6" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>
      );
    case "quill":
      return (
        <g>
          <path
            d="M178 66c-14 8-28 24-34 44-2 8-2 14 0 18 6-2 12-8 18-16 10-14 16-32 16-46Z"
            fill={color}
          />
          <path d="M162 92c-6 10-10 22-12 32" stroke="#1C7A6C" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
          <path d="M144 128l-6 14" stroke="#221D2E" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

/**
 * Inki, the companion — one component used on every screen so the mascot is
 * consistent everywhere, wearing whatever the student has earned.
 */
export function Inki({ size = 180, equipped, mood = "happy", decorative = false, className }: InkiProps) {
  const scene = equipped?.scene ? ITEM_ART[equipped.scene] : undefined;
  const hat = equipped?.hat ? ITEM_ART[equipped.hat] : undefined;
  const neck = equipped?.neck ? ITEM_ART[equipped.neck] : undefined;
  const held = equipped?.held ? ITEM_ART[equipped.held] : undefined;

  const eyeY = mood === "think" ? 84 : 83;
  const pupilOffset = mood === "think" ? 3 : 0;

  return (
    <svg
      width={size}
      height={size * (210 / 200)}
      viewBox="0 0 200 210"
      fill="none"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : "Inki, your writing companion"}
    >
      {scene ? <Scene art={scene.art} color={scene.color} /> : null}

      {/* tentacles */}
      <path
        d="M62 112c-8 20-22 28-38 31 12 10 28 8 36-4M138 112c8 20 22 28 38 31-12 10-28 8-36-4M80 128c-5 22-10 32-17 42 14 3 24-6 27-21M120 128c5 22 10 32 17 42-14 3-24-6-27-21M100 132c0 22-2 34-4 46 9 2 15-6 16-20"
        stroke={BODY}
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* body */}
      <ellipse cx="100" cy="85" rx="50" ry="46" fill={BODY} />
      <ellipse cx="100" cy="70" rx="34" ry="22" fill="#FFFFFF" fillOpacity="0.12" />

      {/* face */}
      <circle cx="83" cy={eyeY} r="12" fill="#FFFFFF" />
      <circle cx="117" cy={eyeY} r="12" fill="#FFFFFF" />
      <circle cx={85 + pupilOffset} cy={eyeY + 2} r="6" fill="#221D2E" />
      <circle cx={119 + pupilOffset} cy={eyeY + 2} r="6" fill="#221D2E" />
      <circle cx={87.5 + pupilOffset} cy={eyeY - 1} r="2.2" fill="#FFFFFF" />
      <circle cx={121.5 + pupilOffset} cy={eyeY - 1} r="2.2" fill="#FFFFFF" />

      {mood === "cheer" ? (
        <path d="M88 104c4 8 20 8 24 0" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
      ) : (
        <path d="M91 104c3 4 15 4 18 0" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
      )}

      <circle cx="66" cy="99" r="6" fill="#FF9B82" fillOpacity="0.5" />
      <circle cx="134" cy="99" r="6" fill="#FF9B82" fillOpacity="0.5" />

      {neck ? <Neck art={neck.art} color={neck.color} /> : null}
      {held ? <Held art={held.art} color={held.color} /> : null}
      {hat ? <Hat art={hat.art} color={hat.color} /> : null}
    </svg>
  );
}

/** Small standalone preview used on closet cards. */
export function ItemPreview({ itemKey, size = 56 }: { itemKey: string; size?: number }) {
  const art = ITEM_ART[itemKey];
  if (!art) return null;

  return (
    <svg width={size} height={size} viewBox="40 0 120 180" fill="none" aria-hidden="true">
      {art.slot === "hat" ? <Hat art={art.art} color={art.color} /> : null}
      {art.slot === "neck" ? (
        <g transform="translate(0 -80)">
          <Neck art={art.art} color={art.color} />
        </g>
      ) : null}
      {art.slot === "held" ? (
        <g transform="translate(-70 -30)">
          <Held art={art.art} color={art.color} />
        </g>
      ) : null}
      {art.slot === "scene" ? (
        <g transform="translate(40 20) scale(0.62)">
          <Scene art={art.art} color={art.color} />
        </g>
      ) : null}
    </svg>
  );
}
