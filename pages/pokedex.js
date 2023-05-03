import React, { useEffect } from "react";
import Image from 'next/image'
import { Canvas } from "@react-three/fiber";
import styles from "@/styles/Pokedex.module.css";
import { Box, LightBulb } from "./components/sprites";

const Pokedex = () => {
  return (
    <div className={styles.pokedex}>
      <div className={styles.topScreen} />
      <div className={styles.screen}>
      {/* <div style={{ width: '300px', height: '300px' }}> */}
        <Canvas
          // size={{ width: 5, height: 5 }}
          width= {100}
          height={100}
          style={{ border: "1px solid black", backgroundColor: "lightgray" }}
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [-6, 7, 7]
          }}
        >
          <ambientLight color={"white"} intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
            {/* <LightBulb position={[0, 3, 0]} /> */}
            <Box rotateX={3} rotateY={0.2}  />
        </Canvas>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Pokedex;