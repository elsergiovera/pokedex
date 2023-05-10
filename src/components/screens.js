import React from "react";
import { TextureLoader } from "three";
import { useLoader, useFrame  } from "@react-three/fiber";

const BigScreen = (props) => {
  return props.frontArtwork ? (
    <>
      <mesh>
        <directionalLight position={[0, 0, 5]} />
        <planeGeometry args={[1.4, 1.4, 2, 2]} />
        <meshStandardMaterial map={useLoader(TextureLoader, props.frontArtwork)} transparent={true} />
      </mesh>
    </>
    ) : null;
};

const SmallScreen = (props) => {   
  useFrame(({clock}) => {
    if(props.spriteRef.current != undefined)
      props.spriteRef.current.rotation.y = clock.getElapsedTime() * 2
  });

  if(props.pkmnData.sprites != undefined) {
    return (
      <>
        <directionalLight position={[0, 0, 5]} />
        <mesh ref={props.spriteRef} position={[0, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[1.5, 1.5, 1, 1]} />
            <meshBasicMaterial map={useLoader(TextureLoader, props.isShiny ? props.pkmnData.sprites.front_shiny : props.pkmnData.sprites.front_default)} transparent={true} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.5, 1.5, 1, 1]} />
            <meshBasicMaterial map={useLoader(TextureLoader, props.isShiny ? props.pkmnData.sprites.back_shiny : props.pkmnData.sprites.back_default)} transparent={true} />
          </mesh>
        </mesh>
      </>
    );
  }
};

export { BigScreen, SmallScreen };