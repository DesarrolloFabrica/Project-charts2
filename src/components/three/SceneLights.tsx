import { Environment } from "@react-three/drei";

function SceneLights() {
  return (
    <>
      <Environment preset="city" environmentIntensity={0.38} />

      <ambientLight intensity={0.05} color="#dbe7ff" />

      <directionalLight
        position={[5, 6, 4]}
        intensity={0.9}
        color="#ffffff"
      />

      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.3}
        color="#7aa2ff"
      />

      <pointLight
        position={[0, -3, 3]}
        intensity={0.24}
        color="#5d74ff"
        distance={12}
      />
    </>
  );
}

export default SceneLights;