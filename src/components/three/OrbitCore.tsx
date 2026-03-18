import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  DoubleSide,
  CanvasTexture,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NormalBlending,
  RepeatWrapping,
} from "three";
import type { OrbitVariant } from "./orbitVariants";
import type { MutableRefObject } from "react";
import type { OrbitStoryValues } from "../../hooks/useHeroScrollTimeline";

type OrbitCoreProps = {
  preset: OrbitVariant;
  mixRef: MutableRefObject<{ value: number }>;
  weightMode: "from" | "to";
  orbitStoryRef: MutableRefObject<OrbitStoryValues>;
};

function OrbitCore({ preset, mixRef, weightMode, orbitStoryRef }: OrbitCoreProps) {
  const AURA_SCALE = 2.08;
  const OUTER_SCALE = 1.08;
  const INNER_SCALE = 0.72;

  const auraMatRef = useRef<MeshBasicMaterial | null>(null);
  const outerMatRef = useRef<MeshPhysicalMaterial | null>(null);
  const mainMatRef = useRef<MeshPhysicalMaterial | null>(null);
  const innerMatRef = useRef<MeshPhysicalMaterial | null>(null);
  const rimMatRef = useRef<MeshBasicMaterial | null>(null);
  const haloMatRefs = useRef<Array<MeshBasicMaterial | null>>([]);
  const accentMatRefs = useRef<Array<MeshBasicMaterial | null>>([]);

  const presetRef = useRef(preset);
  const weightModeRef = useRef(weightMode);

  const noiseMap = useMemo(() => {
    // Fallback sin asset externo: evita errores si no existe
    // `public/textures/noise-soft.jpg` y permite que el render funcione.
    // (CanvasTexture se usa como normalMap para dar detalle visual.)
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new CanvasTexture(canvas);

    const img = ctx.createImageData(size, size);
    // PRNG determinista para evitar `Math.random()` (regla de pureza en React).
    let seed = 123456789;
    const nextRand01 = () => {
      seed ^= seed << 13;
      seed ^= seed >> 17;
      seed ^= seed << 5;
      // `>>> 0` para tratar el número como unsigned.
      return (seed >>> 0) / 0xffffffff;
    };
    for (let i = 0; i < size * size; i++) {
      // Ruido monocromático (simple). Para un normal-map "perfecto" habría que
      // generar vectores, pero esto evita que el render falle.
      const v = Math.floor(nextRand01() * 256);
      const j = i * 4;
      img.data[j] = v;
      img.data[j + 1] = v;
      img.data[j + 2] = v;
      img.data[j + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);

    const tex = new CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const initialWW = weightMode === "from" ? 0 : 1;
  const initialCoreFadeLift = 0.4 + 0.6 * initialWW;
  const initialGlowLift = 0.45 + 0.55 * initialWW;

  useEffect(() => {
    presetRef.current = preset;
    weightModeRef.current = weightMode;
    haloMatRefs.current.length = preset.visuals.halos.length;
    accentMatRefs.current.length = preset.visuals.accents.length;
  }, [preset, weightMode]);

  useFrame(({ clock }) => {
    const currentPreset = presetRef.current;
    const currentWeightMode = weightModeRef.current;

    const m = mixRef.current.value;
    const w = currentWeightMode === "from" ? 1 - m : m;
    const ww = Math.max(0, Math.min(1, w));

    const energy = orbitStoryRef.current.energy;
    const energyStrength = 0.78 + Math.max(0, Math.min(1.2, energy)) * 0.55;

    const coreFadeLift = 0.4 + 0.6 * ww;
    const glowLift = 0.45 + 0.55 * ww;
    const pulse = 0.98 + Math.sin(clock.getElapsedTime() * 1.2) * 0.015;

    if (auraMatRef.current) {
      auraMatRef.current.opacity = currentPreset.visuals.auraOpacity * 0.07 * glowLift * energyStrength;
    }

    if (outerMatRef.current) {
      outerMatRef.current.opacity = currentPreset.visuals.outerOpacity * 0.18 * ww * energyStrength;
      outerMatRef.current.emissiveIntensity = 0.0;
    }

    if (mainMatRef.current) {
      mainMatRef.current.opacity = currentPreset.visuals.mainOpacity * 0.7 * coreFadeLift;
      mainMatRef.current.emissiveIntensity =
        currentPreset.visuals.emissiveMain * glowLift * (0.85 + energy * 0.35);
    }

    if (innerMatRef.current) {
      // Menos “pasta luminosa”: controlar opacidad por preset y suavizar el glow.
      innerMatRef.current.opacity = currentPreset.visuals.innerOpacity * (0.75 + 0.25 * coreFadeLift);
      innerMatRef.current.emissiveIntensity =
        currentPreset.visuals.emissiveInner * glowLift * pulse * 0.45 * energyStrength;
    }

    if (rimMatRef.current) {
      rimMatRef.current.color.set(currentPreset.theme.haloColorSecondary);
      rimMatRef.current.opacity = (0.006 + 0.015 * ww) * glowLift * (0.8 + energy * 0.3);
    }

    haloMatRefs.current.forEach((mat, idx) => {
      const halo = currentPreset.visuals.halos[idx];
      if (!mat || !halo) return;
      mat.opacity = halo.opacity * 0.25 * ww * energyStrength;
    });

    accentMatRefs.current.forEach((mat, idx) => {
      const accent = currentPreset.visuals.accents[idx];
      if (!mat || !accent) return;
      mat.opacity = accent.opacity * 0.28 * ww * energyStrength;
    });
  });

  return (
    <group scale={preset.visuals.coreScale}>
      {/* AURA MUY SUAVE */}
      <mesh scale={AURA_SCALE}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          ref={auraMatRef}
          color={preset.theme.auraColor}
          transparent
          opacity={preset.visuals.auraOpacity * 0.07 * initialGlowLift}
          blending={NormalBlending}
          depthWrite={false}
          depthTest
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* SHELL EXTERNO MUY SUTIL */}
      <mesh scale={OUTER_SCALE}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhysicalMaterial
          ref={outerMatRef}
          color={preset.theme.coreOuterColor}
          transparent
          opacity={preset.visuals.outerOpacity * 0.18 * initialWW}
          metalness={0.02}
          roughness={0.12}
          transmission={0.86}
          ior={1.22}
          thickness={0.45}
          clearcoat={1}
          clearcoatRoughness={0.09}
          iridescence={0.06}
          iridescenceIOR={1.15}
          iridescenceThicknessRange={[180, 320]}
          depthWrite={false}
          normalMap={noiseMap}
          normalScale={[0.08, 0.08]}
        />
      </mesh>

      {/* ESFERA PRINCIPAL */}
      <mesh>
        <sphereGeometry args={[1, 160, 160]} />
        <meshPhysicalMaterial
          ref={mainMatRef}
          color={preset.theme.coreMainColor}
          transparent
          opacity={preset.visuals.mainOpacity * 0.7 * initialCoreFadeLift}
          metalness={0.04}
          roughness={0.28}
          transmission={0.52}
          ior={1.28}
          thickness={1.35}
          clearcoat={1}
          clearcoatRoughness={0.14}
          emissive="#0B1124"
          emissiveIntensity={preset.visuals.emissiveMain * initialGlowLift}
          depthWrite={false}
          normalMap={noiseMap}
          normalScale={[0.12, 0.12]}
        />
      </mesh>

      {/* RIM MUY DISCRETO */}
      <mesh scale={1.018}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshBasicMaterial
          ref={rimMatRef}
          color={preset.theme.haloColorSecondary}
          transparent
          opacity={(0.006 + 0.015 * initialWW) * initialGlowLift}
          blending={NormalBlending}
          depthWrite={false}
          depthTest
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* NÚCLEO INTERIOR DENSO */}
      <mesh scale={INNER_SCALE}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshPhysicalMaterial
          ref={innerMatRef}
          color={preset.theme.coreInnerColor}
          transparent
          opacity={preset.visuals.innerOpacity * (0.75 + 0.25 * initialCoreFadeLift)}
          metalness={0.65}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.18}
          emissive="#09101F"
          emissiveIntensity={preset.visuals.emissiveInner * initialGlowLift * 0.6}
          normalMap={noiseMap}
          normalScale={[0.06, 0.06]}
        />
      </mesh>

      {preset.visuals.halos.map((halo, haloIndex) => (
        <mesh key={`${preset.id}-${halo.radius}-${halo.tube}`} rotation={halo.rotation}>
          <torusGeometry
            args={[halo.radius, halo.tube, halo.radialSegments ?? 16, halo.tubularSegments ?? 220]}
          />
          <meshBasicMaterial
            ref={(node) => {
              haloMatRefs.current[haloIndex] = node;
            }}
            color={halo.color}
            transparent
            opacity={halo.opacity * 0.25 * initialWW}
            blending={NormalBlending}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>
      ))}

      {preset.visuals.accents.map((accent, idx) => (
        <mesh key={`${preset.id}-accent-${idx}`} position={accent.position}>
          <sphereGeometry args={[accent.size, 18, 18]} />
          <meshBasicMaterial
            ref={(node) => {
              accentMatRefs.current[idx] = node;
            }}
            color={accent.color}
            transparent
            opacity={accent.opacity * 0.28 * initialWW}
            blending={NormalBlending}
            depthWrite={false}
            depthTest
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default OrbitCore;