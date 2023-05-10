import React, { useRef } from "react";
import { TextureLoader } from "three";
import * as THREE from 'three';
import { useLoader, useFrame, useThree  } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';

const BigScreen = (props) => {
  return props.pkmnData != "" ? (
    <>
      <mesh>
        <directionalLight position={[0, 0, 5]} />
        <planeGeometry args={[1.4, 1.4, 2, 2]} />
        <meshStandardMaterial map={useLoader(TextureLoader, props.isShiny ? props.pkmnData.sprites.other["official-artwork"].front_shiny : props.pkmnData.sprites.other["official-artwork"].front_default)} transparent={true} />
      </mesh>
      <OrbitControls
          enableDamping={false}
          enableRotate={true}
          enablePan={false}
          enableZoom={true}
          minDistance={0.3}
          maxDistance={1}
          rotateSpeed={0.5}
          zoomSpeed={2}
          // minAzimuthAngle={0}
          // maxAzimuthAngle={0}
          // minPolarAngle={Math.PI / 2}
          // maxPolarAngle={-Math.PI - Math.PI / 2}
          minAzimuthAngle={-Math.PI / 20}
          maxAzimuthAngle={Math.PI / 20}
          minPolarAngle={Math.PI / 2 - 0.1}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
    </>
    ) : null;
};

const SmallScreen = (props) => {   
  useFrame(({clock}) => {
    if(props.spriteRef.current != undefined)
      props.spriteRef.current.rotation.y = clock.getElapsedTime() * 2
  });

  return props.pkmnData != "" ? (
    <>
      <directionalLight position={[0, 0, 5]} />
      <mesh ref={props.spriteRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.2, 1.5, 1, 1]} />
          <meshBasicMaterial map={useLoader(TextureLoader, props.isShiny ? props.pkmnData.sprites.front_shiny : props.pkmnData.sprites.front_default)} transparent={true} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.2, 1.5, 1, 1]} />
          <meshBasicMaterial map={useLoader(TextureLoader, props.isShiny ? props.pkmnData.sprites.back_shiny : props.pkmnData.sprites.back_default)} transparent={true} />
        </mesh>
      </mesh>
    </>
  ) : null;
};

export { BigScreen, SmallScreen };