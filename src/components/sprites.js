import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

const SpriteScene = (sprite) => {
  const sprite = useLoader(TextureLoader, "../public/no_data.png");

  return (
    <mesh scale={1.5}>
      <directionalLight position={[0, 0, 5]} />
      <planeGeometry  />
      <meshStandardMaterial map={sprite} transparent/>
    </mesh>
  );
};

export default SpriteScene;