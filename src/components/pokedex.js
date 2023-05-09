import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image'
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { getPokemonList, getPokemonData } from "../data/pokeapi";
import styles from "@/styles/Pokedex.module.css";

import { BigScreen, SmallScreen } from "./screens"

const Pokedex = () => {
  // variables.
  const [pkmnList, setPkmnList] = useState([]);
  const [pkmnData, setPkmnData] = useState("");

  // sprites
  const [srcFrontArtwork, setSrcFrontArtwork] = useState("");
  const [srcFrontSprite, setSrcFrontSprite] = useState("");
  const [srcBackSprite, setSrcBackSprite] = useState("");
  const [srcFrontSpriteShiny, setSrcFrontSpriteShiny] = useState("");
  const [srcBackSpriteShiny, setSrcBackSpriteShiny] = useState("");
  const spriteRef = useRef();
  
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
        }
        else
          setPkmnData("");
      }
      getPkmnInfo();
    }
    else {
      setPkmnData("");
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
  // selected Pokémon hook.
  useEffect(() => {
    if (pkmnData !== "") {
      setSrcFrontArtwork(pkmnData.sprites.other["official-artwork"].front_default);
      setSrcFrontSprite(pkmnData.sprites.front_default);
      setSrcBackSprite(pkmnData.sprites.back_default);
    }
    else {
      setSrcFrontArtwork("");
      setSrcFrontSprite("");
      setSrcBackSprite("");
    }
    PokemonInfo();

  }, [pkmnData]);

  return (
    <div className={styles.pokedex}>
      <div className={styles.innerBorder}>
        {/* Left Side */}
        <div className={styles.leftSide} >
          <div className={styles.topScreenLeft} />
          <div className={styles.screenLeft}>
            <div className={styles.bigScreenCanvas}>
              <Canvas
                style={{ border: "8px solid #320309", backgroundColor: "#2d2b2c" }}
                shadows="soft"
                camera={{
                  fov: 75,
                  near: 0.1,
                  far: 1000,
                  position: [0, 0, 1]
                }}
              >
                <BigScreen frontArtwork={srcFrontArtwork}  />
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
          </div>
          <div className={styles.panelLeft}>
            <input
              type={"search"}
              id={"searchBar"}
              placeholder={"Type the Pokémon name"}
              className={styles.searchBar}
              onChange={handlerOnChangeSearchBar}
              autoComplete="off"
              list={"PkmnList"} />
          </div>
          <div className={styles.bottomRow}>
            <Image src="/bottom_buttons_2.png" width={100} height={15} alt="" />
          </div>
        </div>
        {/* Center Fold */}
        <div className={styles.centerFold} />
        {/* Right Side */}
        <div className={styles.rightSide} >
          <div className={styles.topScreenRight} />
          <div className={styles.screenRight}>
            <div className={styles.smallScreenCanvas}>
              <Canvas
                  style={{ border: "8px solid #320309", backgroundColor: "#2d2b2c" }}
                  shadows="soft"
                  camera={{
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    position: [0, 0, 1]
                  }}
                >
                  <SmallScreen spriteRef={spriteRef} frontSprite={srcFrontSprite} backSprite={srcBackSprite} />
                </Canvas>
            </div>
            {/* <div className={styles.screenRightInfo}>
              Generation: <br />
              Height: <br />
              Weight: <br />
            </div> */}
            <div className={styles.artworkPanel}>
              <button className={styles.artworkButtonDefault}></button>&nbsp;
              <button className={styles.artworkButtonShiny}></button>
            </div>
          </div>
          <div className={styles.panelRight} >
            <div className={styles.infoBar} ><PokemonInfo /></div>
          </div>
          <div className={styles.bottomRow}>
            <Image src="/bottom_buttons_1.png" width={100} height={15} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex;