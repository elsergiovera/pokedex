import React, { useState, useEffect } from "react";
import { TextureLoader } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei'

const SpriteScene = (props) => {
  // const [srcFrontSprite, setSrcFrontSprite] = useState(() => {useLoader(TextureLoader, props.frontSprite)});

  useEffect(() => {
  }, [props.frontSprite])

  return (
    <>
    <Canvas
      style={{ border: "8px solid #2d2b2c", backgroundColor: "#4fa95f" }}
      shadows="soft"
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [0, 0, 1]
      }}
    >
      <OrbitControls
        enablePan={false}
        enableRotate={true}
        enableZoom={false}
        rotateSpeed={0.5}

        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
      <mesh>
        <directionalLight position={[0, 0, 5]} />
        <planeGeometry args={[1.5, 1.5, 2, 2]} />
        <meshStandardMaterial map={frontSprite} />
      </mesh>
    </Canvas>
    </>
  );
};

export default SpriteScene;