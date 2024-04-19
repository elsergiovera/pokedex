import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image'
import { Canvas } from "@react-three/fiber";
import { getPokemonList, getPokemonData } from "../data/pokeapi";
import styles from "@/styles/Pokedex.module.css";
import { Screen} from "./screens"

const Pokedex = () => {
  // States.
  const [pkmnList, setPkmnList] = useState([]);
  const [pkmnData, setPkmnData] = useState("");
  const [isShiny , setIsShiny] = useState(false);
  const spriteRef = useRef();
  
  // Pokémon list load.
  useEffect(() => {
    const getPkmnList = async () => {
      const resp = await getPokemonList();

      if(resp.length > 0) {
        setPkmnList(resp);
      }
    }
    getPkmnList();
  }, []);

  // Search bar hanlder.
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

  // Small screen component.
  const SmallScreenInfo = () => {
    return (
      <div>
        {pkmnData == "" ?
          ( <></> ) :
          (
            <>
              {
                pkmnData.types.length > 1 ?
                "Types: " :
                "Type: "
              }
              {
                pkmnData.types.map((type, index) => (
                  type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1) + (pkmnData.types.length-1 === index ? "." : ", ")
                ))
              }<br />
              Height: {pkmnData.height}<br />
              Weight: {pkmnData.weight}<br />
            </>
          )
        }
      </div>
    )
  };

  // Green screen component.
  const GreenScreenInfo = () => {
    return (
      <div>
        {pkmnData == "" ?
          ( <></> ) :
          (
            <>
              <h4><center>{pkmnData.legend}</center></h4>
              <h5><center>{pkmnData.generation}</center></h5>
              <br/>
              {pkmnData.description}<br />
            </>
          )
        }
      </div>
    )
  };

  return (
    <div className={styles.pokedex}>
      <div className={styles.innerBorder}>
        {/* Left Side */}
        <div className={styles.leftSide} >
          <div className={styles.topScreenLeft} />
          <div className={styles.bigScreen}>
            <div className={styles.bigScreenCanvas}>
              <Canvas
                style={{ backgroundColor: "#2d2b2c" }}
                shadows="soft"
                camera={{
                  fov: 75,
                  near: 0.1,
                  far: 1000,
                  position: [0, 0, 1]
                }}
              >
                <Screen pkmnData={pkmnData} isShiny={isShiny} isMain={true} spriteRef={spriteRef} />
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
            <Image src="/bottom.png" width={150} height={15} alt="" />
          </div>
        </div>
        {/* Center Fold */}
        <div className={styles.centerFold} />
        {/* Right Side */}
        <div className={styles.rightSide} >
          <div className={styles.topScreenRight} />
          <div className={styles.smallScreen}>
            <div className={styles.smallScreenCanvas}>
              <Canvas
                  style={{ backgroundColor: "#2d2b2c" }}
                  shadows="soft"
                  camera={{
                    fov: 75,
                    near: 0.1,
                    far: 1000,
                    position: [0, 0, 1]
                  }}
                >
                  <Screen pkmnData={pkmnData} isShiny={isShiny} spriteRef={spriteRef} />
                </Canvas>
            </div>
            <div className={styles.screenRightInfo}>
              <SmallScreenInfo />
            </div>
          </div>
          <div className={styles.panelRight} >
            <div className={styles.artworkPanel}>
              <button className={styles.artworkButtonNormal} onClick={() => {setIsShiny(false)}}>normal</button>&nbsp;
              <button className={styles.artworkButtonShiny} onClick={() => {setIsShiny(true)}}>shiny</button>
            </div>
            <div className={styles.greenScreen}><GreenScreenInfo /></div>
          </div>
          <div className={styles.bottomRow}>
            <Image src="/bottom.png" width={150} height={15} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pokedex;