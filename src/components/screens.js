import React, { useRef } from "react";
import { TextureLoader } from "three";
import { useLoader, useFrame, useThree  } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';


const Screen = (props) => {
  return props.pkmnData != ""
    ? (
        props.isMain
        ? <BigScreen pkmnData={props.pkmnData} isShiny={props.isShiny} />
        : <SmallScreen pkmnData={props.pkmnData} isShiny={props.isShiny} spriteRef={props.spriteRef} />
      )
    : null
}

const BigScreen = (props) => {
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  const map = useLoader(TextureLoader, props.isShiny ? props.pkmnData?.sprites.other["official-artwork"].front_shiny : props.pkmnData?.sprites?.other["official-artwork"].front_default);
  
  return (
    <>
      <mesh>
        <directionalLight position={[0, 0, 5]} />
        <planeGeometry args={[1.4, 1.4, 2, 2]} />
        <meshStandardMaterial map={map} transparent={true} />
      </mesh>
      <OrbitControls
          enableDamping={false}
          enableRotate={true}
          enableZoom={true}
          enablePan={false}
          minDistance={0.3}
          maxDistance={1}
          rotateSpeed={0.5}
          zoomSpeed={2}
          minAzimuthAngle={-Math.PI / 20}
          maxAzimuthAngle={Math.PI / 20}
          minPolarAngle={Math.PI / 2 - 0.1}
          maxPolarAngle={Math.PI / 2 + 0.1}
          ref={controlsRef} args={[camera, gl.domElement]}
        />
    </>
  )
};

const SmallScreen = (props) => {
  const mapFront = useLoader(TextureLoader, props.isShiny ? props.pkmnData.sprites.front_shiny : props.pkmnData.sprites.front_default);
  const mapBack = useLoader(TextureLoader, props.isShiny ? props.pkmnData.sprites.back_shiny : props.pkmnData.sprites.back_default);

  useFrame(({clock}) => {
    if(props.spriteRef.current != undefined)
      props.spriteRef.current.rotation.y = clock.getElapsedTime() * 2
  });

  return (
    <>
      <directionalLight position={[0, 0, 5]} />
      <mesh ref={props.spriteRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1.2, 1.5, 1, 1]} />
          <meshBasicMaterial map={mapFront} transparent={true} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.2, 1.5, 1, 1]} />
          <meshBasicMaterial map={mapBack} transparent={true} />
        </mesh>
      </mesh>
    </>
  )
};

export { Screen };