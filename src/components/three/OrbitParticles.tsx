import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { AdditiveBlending, Group, Mesh, MeshBasicMaterial } from "three";
import type { OrbitVariant } from "./orbitVariants";
import type { MutableRefObject } from "react";
import type { OrbitStoryValues } from "../../hooks/useHeroScrollTimeline";

type OrbitParticlesProps = {
  preset: OrbitVariant;
  mixRef: MutableRefObject<{ value: number }>;
  weightMode: "from" | "to";
  orbitStoryRef: MutableRefObject<OrbitStoryValues>;
};

function OrbitParticles({ preset, mixRef, weightMode, orbitStoryRef }: OrbitParticlesProps) {
  const arcRefs = useRef<Array<Group | null>>([]);
  const accentRefs = useRef<Array<Mesh | null>>([]);
  const arcMatRefs = useRef<Array<MeshBasicMaterial | null>>([]);
  const accentMatRefs = useRef<Array<MeshBasicMaterial | null>>([]);

  const presetRef = useRef(preset);
  const weightModeRef = useRef(weightMode);

  useEffect(() => {
    presetRef.current = preset;
    weightModeRef.current = weightMode;

    arcMatRefs.current.length = preset.visuals.particleArcs.length;
    accentMatRefs.current.length = preset.visuals.particleAccents.length;
  }, [preset, weightMode]);

  useFrame(({ clock }, delta) => {
    const currentPreset = presetRef.current;
    const currentWeightMode = weightModeRef.current;

    const elapsed = clock.getElapsedTime();
    const m = mixRef.current.value;
    const w = currentWeightMode === "from" ? 1 - m : m;
    const ww = Math.max(0, Math.min(1, w));

    const orbitSpeed = currentPreset.visuals.particleOrbitSpeed;
    const energy = orbitStoryRef.current.energy;
    const energyStrength = 0.7 + Math.max(0, Math.min(1.2, energy)) * 0.6;
    const motionBoost = 0.86 + Math.max(0, Math.min(1.2, energy)) * 0.4;

    arcRefs.current.forEach((arc, index) => {
      if (!arc) return;
      const dir = index % 2 === 0 ? 1 : -1;
      const base = index % 3 === 0 ? 0.024 : 0.016;
      arc.rotation.y += delta * base * dir * orbitSpeed * motionBoost;
      arc.rotation.z += delta * 0.0012 * dir * orbitSpeed * motionBoost;

      const mat = arcMatRefs.current[index];
      const arcCfg = currentPreset.visuals.particleArcs[index];
      if (mat && arcCfg) mat.opacity = arcCfg.opacity * ww * energyStrength;
    });

    const pulseSpeed = currentPreset.visuals.particlePulseSpeed;
    accentRefs.current.forEach((accent, idx) => {
      if (!accent) return;
      const tw = (Math.sin(elapsed * 0.55 * pulseSpeed + idx * 1.8) + 1) / 2;
      const s = 0.96 + tw * (0.08 + idx * 0.002);
      accent.scale.setScalar(s * (1 + energy * 0.14));

      const mat = accentMatRefs.current[idx];
      const accentCfg = currentPreset.visuals.particleAccents[idx];
      if (mat && accentCfg) mat.opacity = accentCfg.opacity * ww * energyStrength;
    });
  });

  return (
    <group scale={preset.visuals.coreScale}>
      {preset.visuals.particleArcs.map((arc, arcIndex) => (
        <group
          key={`${preset.id}-arc-${arcIndex}`}
          ref={(node) => {
            arcRefs.current[arcIndex] = node;
          }}
          rotation={arc.tilt}
        >
          <mesh>
            <ringGeometry
              args={[
                arc.radius - 0.018,
                arc.radius + 0.018,
                96,
                1,
                arc.arcStart,
                arc.arcLength,
              ]}
            />
            <meshBasicMaterial
              ref={(node) => {
                arcMatRefs.current[arcIndex] = node;
              }}
              color={arc.color}
              transparent
              blending={AdditiveBlending}
              depthWrite={false}
              depthTest={false}
              opacity={0}
            />
          </mesh>
        </group>
      ))}

      {preset.visuals.particleAccents.map((accent, index) => (
        <mesh
          key={`${preset.id}-accent-${index}`}
          ref={(node) => {
            accentRefs.current[index] = node;
          }}
          position={accent.position}
        >
          <sphereGeometry args={[accent.size, 12, 12]} />
          <meshBasicMaterial
            ref={(node) => {
              accentMatRefs.current[index] = node;
            }}
            color={accent.color}
            transparent
            opacity={0}
            blending={AdditiveBlending}
            depthWrite={false}
            depthTest={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default OrbitParticles;