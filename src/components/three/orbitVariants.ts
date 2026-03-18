export type OrbitVisualPreset = "clean" | "energetic" | "advanced";

export type OrbitHalo = {
  radius: number; // relativo al core (core unit sphere = 1)
  tube: number;
  radialSegments?: number;
  tubularSegments?: number;
  rotation: [number, number, number];
  color: string;
  opacity: number;
};

export type OrbitAccent = {
  position: [number, number, number]; // relativo al core unit sphere (escala por preset.coreScale)
  size: number;
  color: string;
  opacity: number;
};

export type OrbitParticleArc = {
  radius: number; // relativo al core unit sphere
  tilt: [number, number, number];
  arcStart: number;
  arcLength: number;
  opacity: number;
  color: string;
};

export type OrbitParticleAccent = {
  position: [number, number, number];
  size: number;
  color: string;
  opacity: number;
};

export type OrbitVariant = {
  id: string;
  titleLines: [string, string];
  subtitle: string;
  visualPreset: OrbitVisualPreset;
  theme: {
    glowColor: string;
    auraColor: string;
    coreOuterColor: string;
    coreMainColor: string;
    coreInnerColor: string;
    haloColorPrimary: string;
    haloColorSecondary: string;
    accentA: string;
    accentB: string;
    accentC: string;
    titleGradient: [string, string, string];
  };
  visuals: {
    coreScale: number;
    auraOpacity: number;
    outerOpacity: number;
    mainOpacity: number;
    innerOpacity: number;
    emissiveMain: number;
    emissiveInner: number;
    orbitSpeedMultiplier: number;
    particleOrbitSpeed: number;
    particlePulseSpeed: number;
    cameraNudge: [number, number, number];
    halos: OrbitHalo[];
    accents: OrbitAccent[];
    particleArcs: OrbitParticleArc[];
    particleAccents: OrbitParticleAccent[];
  };
};

// Nota: valores “relativos” al core unit sphere (radio=1). La escala final se aplica con visuals.coreScale.
export const ORBIT_VARIANTS: OrbitVariant[] = [
  {
    id: "core-1",
    titleLines: ["NEXT", "ORBIT"],
    subtitle:
      "A new dimension of digital experience crafted to feel cinematic, intelligent and visually unforgettable from the very first scroll.",
    visualPreset: "clean",
    theme: {
      glowColor: "#7C5CFF",
      auraColor: "#7C5CFF",
      coreOuterColor: "#7FA6FF",
      coreMainColor: "#DDE6FF",
      coreInnerColor: "#B9C6EA",
      haloColorPrimary: "#7C5CFF",
      haloColorSecondary: "#4DA6FF",
      accentA: "#B995FF",
      accentB: "#FFFFFF",
      accentC: "#8EC5FF",
      titleGradient: ["#FFFFFF", "#DDE6FF", "#7C5CFF"],
    },
    visuals: {
      coreScale: 1.0,
      auraOpacity: 0.03,
      outerOpacity: 0.07,
      mainOpacity: 1.0,
      innerOpacity: 0.2,
      emissiveMain: 0.05,
      emissiveInner: 0.08,
      orbitSpeedMultiplier: 1.0,
      particleOrbitSpeed: 1.0,
      particlePulseSpeed: 1.0,
      cameraNudge: [0.02, -0.01, 0.08],
      halos: [
        {
          radius: 1.169, // 2.08 / 1.78
          tube: 0.02,
          radialSegments: 18,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, 0.22, Math.PI / 5],
          color: "#7C5CFF",
          opacity: 0.12,
        },
        {
          radius: 1.315, // 2.34 / 1.78
          tube: 0.012,
          radialSegments: 16,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, -0.26, -Math.PI / 7],
          color: "#4DA6FF",
          opacity: 0.07,
        },
      ],
      accents: [
        {
          position: [-0.202, 0.101, 0.663],
          size: 0.05 / 1.0,
          color: "#B995FF",
          opacity: 0.65,
        },
        {
          position: [0.270, 0.191, 0.640],
          size: 0.07 / 1.0,
          color: "#FFFFFF",
          opacity: 0.62,
        },
        {
          position: [0.405, -0.191, 0.596],
          size: 0.045 / 1.0,
          color: "#8EC5FF",
          opacity: 0.6,
        },
      ],
      particleArcs: [
        {
          radius: 1.326, // 2.36 / 1.78
          tilt: [0.24, 0.2, 0.08],
          arcStart: -0.45,
          arcLength: Math.PI * 1.18,
          opacity: 0.07,
          color: "#7C5CFF",
        },
        {
          radius: 1.528, // 2.72 / 1.78
          tilt: [-0.12, 0.46, 0.14],
          arcStart: 0.62,
          arcLength: Math.PI * 1.08,
          opacity: 0.05,
          color: "#4DA6FF",
        },
      ],
      particleAccents: [
        { position: [-1.98 / 1.78, 0.2 / 1.78, 0.18 / 1.78], size: 0.032, color: "#CFE0FF", opacity: 0.24 },
        { position: [2.26 / 1.78, -0.14 / 1.78, 0.12 / 1.78], size: 0.028, color: "#B995FF", opacity: 0.24 },
      ],
    },
  },
  {
    id: "core-2",
    titleLines: ["KINETIC", "ORBIT"],
    subtitle:
      "Energy flows through the core: layered orbits, reactive glow and precision motion that feels alive under your cursor.",
    visualPreset: "energetic",
    theme: {
      glowColor: "#4DA6FF",
      auraColor: "#4DA6FF",
      coreOuterColor: "#7FA6FF",
      coreMainColor: "#DDE6FF",
      coreInnerColor: "#B9C6EA",
      haloColorPrimary: "#4DA6FF",
      haloColorSecondary: "#7C5CFF",
      accentA: "#4DA6FF",
      accentB: "#FFFFFF",
      accentC: "#B995FF",
      titleGradient: ["#DDE6FF", "#4DA6FF", "#7C5CFF"],
    },
    visuals: {
      coreScale: 1.055,
      auraOpacity: 0.055,
      outerOpacity: 0.1,
      mainOpacity: 1.0,
      innerOpacity: 0.24,
      emissiveMain: 0.07,
      emissiveInner: 0.12,
      orbitSpeedMultiplier: 1.18,
      particleOrbitSpeed: 1.22,
      particlePulseSpeed: 1.25,
      cameraNudge: [-0.02, 0.02, 0.1],
      halos: [
        {
          radius: 1.185,
          tube: 0.02,
          radialSegments: 18,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, 0.26, Math.PI / 5.6],
          color: "#4DA6FF",
          opacity: 0.18,
        },
        {
          radius: 1.315,
          tube: 0.012,
          radialSegments: 16,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, -0.28, -Math.PI / 7],
          color: "#7C5CFF",
          opacity: 0.11,
        },
        {
          radius: 1.415,
          tube: 0.01,
          radialSegments: 14,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, 0.08, -Math.PI / 4.2],
          color: "#B995FF",
          opacity: 0.08,
        },
      ],
      accents: [
        {
          position: [-0.205, 0.108, 0.676],
          size: 0.055,
          color: "#4DA6FF",
          opacity: 0.72,
        },
        {
          position: [0.265, 0.200, 0.648],
          size: 0.075,
          color: "#FFFFFF",
          opacity: 0.66,
        },
        {
          position: [0.415, -0.198, 0.610],
          size: 0.048,
          color: "#B995FF",
          opacity: 0.64,
        },
        {
          position: [0.02, -0.265, 0.72],
          size: 0.035,
          color: "#8EC5FF",
          opacity: 0.55,
        },
      ],
      particleArcs: [
        {
          radius: 1.33,
          tilt: [0.24, 0.18, 0.1],
          arcStart: -0.55,
          arcLength: Math.PI * 1.18,
          opacity: 0.09,
          color: "#4DA6FF",
        },
        {
          radius: 1.54,
          tilt: [-0.1, 0.46, 0.14],
          arcStart: 0.62,
          arcLength: Math.PI * 1.08,
          opacity: 0.07,
          color: "#7C5CFF",
        },
        {
          radius: 1.42,
          tilt: [0.16, 0.08, -0.12],
          arcStart: 1.08,
          arcLength: Math.PI * 0.92,
          opacity: 0.055,
          color: "#B995FF",
        },
      ],
      particleAccents: [
        { position: [-1.98 / 1.78, 0.2 / 1.78, 0.18 / 1.78], size: 0.034, color: "#CFE0FF", opacity: 0.28 },
        { position: [2.26 / 1.78, -0.14 / 1.78, 0.12 / 1.78], size: 0.028, color: "#B995FF", opacity: 0.28 },
        { position: [-0.9 / 1.78, 0.42 / 1.78, -0.08 / 1.78], size: 0.024, color: "#4DA6FF", opacity: 0.22 },
        { position: [1.35 / 1.78, 0.18 / 1.78, -0.12 / 1.78], size: 0.022, color: "#FFFFFF", opacity: 0.2 },
      ],
    },
  },
  {
    id: "core-3",
    titleLines: ["MATIC", "ORBIT"],
    subtitle:
      "A deeper glow with advanced polish: richer cinematic bloom, faster orbital energy and premium depth cues.",
    visualPreset: "advanced",
    theme: {
      glowColor: "#B995FF",
      auraColor: "#B995FF",
      coreOuterColor: "#7FA6FF",
      coreMainColor: "#DDE6FF",
      coreInnerColor: "#B9C6EA",
      haloColorPrimary: "#B995FF",
      haloColorSecondary: "#4DA6FF",
      accentA: "#B995FF",
      accentB: "#FFFFFF",
      accentC: "#4DA6FF",
      titleGradient: ["#FFFFFF", "#B995FF", "#4DA6FF"],
    },
    visuals: {
      coreScale: 1.09,
      auraOpacity: 0.085,
      outerOpacity: 0.13,
      mainOpacity: 1.0,
      innerOpacity: 0.28,
      emissiveMain: 0.1,
      emissiveInner: 0.18,
      orbitSpeedMultiplier: 1.35,
      particleOrbitSpeed: 1.38,
      particlePulseSpeed: 1.5,
      cameraNudge: [0.03, 0.015, 0.14],
      halos: [
        {
          radius: 1.2,
          tube: 0.022,
          radialSegments: 18,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, 0.25, Math.PI / 4.9],
          color: "#B995FF",
          opacity: 0.23,
        },
        {
          radius: 1.33,
          tube: 0.012,
          radialSegments: 16,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, -0.3, -Math.PI / 7],
          color: "#4DA6FF",
          opacity: 0.14,
        },
        {
          radius: 1.46,
          tube: 0.011,
          radialSegments: 14,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, 0.1, -Math.PI / 4.1],
          color: "#7C5CFF",
          opacity: 0.11,
        },
        {
          radius: 1.565,
          tube: 0.009,
          radialSegments: 12,
          tubularSegments: 220,
          rotation: [Math.PI * 0.5, -0.12, Math.PI / 3.2],
          color: "#FFFFFF",
          opacity: 0.075,
        },
      ],
      accents: [
        { position: [-0.21, 0.11, 0.68], size: 0.06, color: "#B995FF", opacity: 0.78 },
        { position: [0.268, 0.2, 0.652], size: 0.08, color: "#FFFFFF", opacity: 0.72 },
        { position: [0.42, -0.19, 0.62], size: 0.052, color: "#4DA6FF", opacity: 0.68 },
        { position: [0.03, -0.265, 0.73], size: 0.036, color: "#7C5CFF", opacity: 0.62 },
        { position: [-0.48, -0.02, 0.78], size: 0.032, color: "#8EC5FF", opacity: 0.55 },
      ],
      particleArcs: [
        { radius: 1.335, tilt: [0.22, 0.18, 0.12], arcStart: -0.55, arcLength: Math.PI * 1.18, opacity: 0.1, color: "#B995FF" },
        { radius: 1.545, tilt: [-0.1, 0.48, 0.14], arcStart: 0.62, arcLength: Math.PI * 1.08, opacity: 0.085, color: "#4DA6FF" },
        { radius: 1.43, tilt: [0.16, 0.08, -0.12], arcStart: 1.08, arcLength: Math.PI * 0.92, opacity: 0.07, color: "#7C5CFF" },
        { radius: 1.25, tilt: [-0.16, -0.08, 0.14], arcStart: -1.25, arcLength: Math.PI * 0.82, opacity: 0.06, color: "#FFFFFF" },
      ],
      particleAccents: [
        { position: [-1.98 / 1.78, 0.2 / 1.78, 0.18 / 1.78], size: 0.034, color: "#CFE0FF", opacity: 0.3 },
        { position: [2.26 / 1.78, -0.14 / 1.78, 0.12 / 1.78], size: 0.028, color: "#B995FF", opacity: 0.3 },
        { position: [-0.9 / 1.78, 0.42 / 1.78, -0.08 / 1.78], size: 0.024, color: "#4DA6FF", opacity: 0.25 },
        { position: [1.35 / 1.78, 0.18 / 1.78, -0.12 / 1.78], size: 0.022, color: "#FFFFFF", opacity: 0.22 },
        { position: [-1.22 / 1.78, -0.28 / 1.78, 0.22 / 1.78], size: 0.02, color: "#7C5CFF", opacity: 0.2 },
      ],
    },
  },
];

export function getVariantByIndex(index: number) {
  const safeIndex = ((index % ORBIT_VARIANTS.length) + ORBIT_VARIANTS.length) % ORBIT_VARIANTS.length;
  return ORBIT_VARIANTS[safeIndex];
}

export function clampIndex(index: number) {
  return Math.max(0, Math.min(ORBIT_VARIANTS.length - 1, index));
}

export function wrapIndex(index: number) {
  const n = ORBIT_VARIANTS.length;
  return ((index % n) + n) % n;
}

