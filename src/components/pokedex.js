import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image'
// import SpriteScene from "./components/sprites";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { TextureLoader } from "three";
import { getPokemonList, getPokemonData } from "../data/pokeapi";
import styles from "@/styles/Pokedex.module.css";

const Pokedex = () => {
  // variables.
  const [pkmnList, setPkmnList] = useState([]);
  const [selPkmn, setSelPkmn] = useState("");
  const [pkmnData, setPkmnData] = useState("");
  const [srcFrontSprite, setSrcFrontSprite] = useState("");

  // functions
  const SpriteScene = () => {
    if(srcFrontSprite == "")
      return (
        <></>
      )
    else {
      return (
        <mesh>
          <directionalLight position={[0, 0, 5]} />
          <planeGeometry args={[1.4, 1.4, 2, 2]} />
          <meshStandardMaterial map={useLoader(TextureLoader, srcFrontSprite)} transparent={true} />
        </mesh>
      );
    }
  };
  const PokemonInfo = () => {
    let info = "";

    if(pkmnData != "") {
      info = (pkmnData.types.length > 1 ? "<strong>Types:</strong> " : "<strong>Type:</strong> ")
      pkmnData.types.map((item, index) => (
        info = info + item.type.name.charAt(0).toUpperCase() + item.type.name.slice(1) + (pkmnData.types.length-1 === index ? ".<br>" : ", ")
      ))
      info = info +
      "<strong>Height:</strong> " + pkmnData.height * 10 + " cms.<br>" +
      "<strong>Weight:</strong> " + pkmnData.weight / 10 + " kgs.<br>" +
      "<strong>Description:</strong> " + pkmnData.description + "<br>" +
      "<strong>Avaliable Since:</strong> " + pkmnData.generation;
    }
    else {
      info = "";
    }

    return (
      <div dangerouslySetInnerHTML={{ __html: info }} />
    );
  };

  // handler for Search Bar.
  const handlerOnChangeSearchBar = (event) => {
    const search = event.target.value.toLowerCase();

    if (pkmnList.find(pkmn => pkmn.toLowerCase() === search)) {
      const getPkmnInfo = async () => {
        if (search != "") {
          const result = await getPokemonData(search);

          setPkmnData(result);
          setSelPkmn(search);
        }
        else
          setPkmnData("");
      }
      getPkmnInfo();
    }
    else {
      setPkmnData("");
      setSelPkmn("");
    }
  };

  // first Load hook.
  useEffect(() => {
    const getPkmnList = async () => {
      const resp = await getPokemonList();

      if(resp.length > 0) {
        setPkmnList(resp);
      }
    }
    getPkmnList();
  }, []);
  // Pokémon list hook.
  useEffect(() => {
    const getPkmnInfo = async () => {
      if (selPkmn != "") {
        const result = await getPokemonData(selPkmn);       
        setPkmnData(result);
      }
      else {
        setSelPkmn("");
        setPkmnData("");
      }

    }
    getPkmnInfo();
  }, [selPkmn]);
  // selected Pokémon hook.
  useEffect(() => {
    if (pkmnData !== "")
      setSrcFrontSprite(pkmnData.sprites.other["official-artwork"].front_default)
    else
      setSrcFrontSprite("");
    PokemonInfo();

  }, [pkmnData]);

  return (
    <div className={styles.pokedex}>
      <div className={styles.innerBorder}>
        {/* Left Side */}
        <div className={styles.leftSide} >
          <div className={styles.topScreenLeft} />
            <div className={styles.screenLeft}>
              <div className={styles.screenLeftCanvas}>
                <Canvas
                  style={{ border: "10px solid #2d2b2c", backgroundColor: "#11709e" }}
                  shadows="soft"
                  camera={{
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    position: [0, 0, 1]
                  }}
                >
                  <SpriteScene />
                  <OrbitControls
                    enableDamping={false}
                    enableRotate={true}
                    enableZoom={false}
                    rotateSpeed={0.5}
                    minAzimuthAngle={-Math.PI / 20}
                    maxAzimuthAngle={Math.PI / 20}
                    minPolarAngle={Math.PI / 2 - 0.1}
                    maxPolarAngle={Math.PI / 2 + 0.1}
                  />
                </Canvas>
              </div>
              <input
                type={"search"}
                id={"searchText"}
                placeholder={"Type the Pokémon name"}
                className={styles.searchText}
                onChange={handlerOnChangeSearchBar}
                autoComplete="off"
                list={"PkmnList"} />
            </div>
          <div className={styles.infoBar} ><PokemonInfo /></div>
          <div className={styles.bottomRow} />
        </div>
        {/* Center Fold */}
        <div className={styles.centerFold} />
        {/* Right Side */}
        <div className={styles.rightSide} >
          <div className={styles.topScreenRight} />
            <div className={styles.screenRight}>
              <div className={styles.screenRightCanvas} />
            </div>
          <div className={styles.screenRightBlueButtons} >
            <Image src="/blue_buttons.png" width={300} height={112} alt="" />
          </div>
          <div className={styles.bottomRow}>
            <Image src="/bottom_buttons_2.png" width={150} height={19} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex;