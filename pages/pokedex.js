import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image'
import { Canvas, useLoader } from "@react-three/fiber";
// import SpriteScene from "./components/sprites"
import { TextureLoader } from "three";
import { listPokemon, getPokemonInfoByName, getPokemonDescription } from "./api/pokeapi";
import styles from "@/styles/Pokedex.module.css";

const Pokedex = () => {
  // variables.
  const pkmnSearchBarRef = useRef();
  const [pkmnList, setPkmnList] = useState([]);
  const [selectedPkmnList, setSelectedPkmnList] = useState("");
  const [selectedPkmnInfo, setSelectedPkmnInfo] = useState("");
  const [selectedPkmnDescription, setPkmnDescription] = useState("");

  const [srcSprite, setSrcSprite] = useState("no_data.png");
  const SpriteScene = () => {
    const sprite = useLoader(TextureLoader, srcSprite);

    return (
      <mesh scale={1.5}>
        <directionalLight position={[0, 0, 5]} />
        <planeGeometry  />
        <meshStandardMaterial map={sprite} />
      </mesh>
    );
  };


  // functions
  const PokemonInfo = () => {
    let info = "";

    if(selectedPkmnInfo != "") {
      //set Sprite.
      // setSrcSprite(selectedPkmnInfo.sprites.other["official-artwork"].front_default);

      // set Info.
      info = 
      "<strong>Height:</strong> " + selectedPkmnInfo.height * 10 + " cms.<br>" +
      "<strong>Weight:</strong> " + selectedPkmnInfo.weight / 10 + " kgs.<br>" +
      "<strong>Types:</strong> ";
      selectedPkmnInfo.types.map((item, index) => (
        info = info + item.type.name + (selectedPkmnInfo.types.length-1 === index ? "<br>" : ", ")
      ))
      info = info + "<strong>Description:</strong> " + selectedPkmnDescription;
    }
    else {
      // setSrcSprite("/no_data.png");
      info = "<strong>No data</strong>";
    }

    return (
      <div dangerouslySetInnerHTML={{ __html: info }} />
    );
  }

  // handlers for Search Bar and Select.
  const handlerSearchSelect = (event) => {
    setSelectedPkmnList(event.target.value);
    pkmnSearchBarRef.current.value = "";
  };
  const handlerOnKeyDownSearchBar = (event) => {
    if (event.key === "Enter") {
      handlerSearchButton();
      pkmnSearchBarRef.current.value = event.target.value;
    }
  }
  // hanlder for Search Button.
  const handlerSearchButton = () => {
    const getPkmnInfo = async () => {
      if (pkmnSearchBarRef.current.value != "") {
        const info = await getPokemonInfoByName(pkmnSearchBarRef.current.value);       
        setSelectedPkmnInfo(info);

        const description = await getPokemonDescription(pkmnSearchBarRef.current.value); 
        setPkmnDescription(description);

        setSelectedPkmnList(pkmnSearchBarRef.current.value);
      }
      else
        setSelectedPkmnInfo("");
    }
    getPkmnInfo();
  };

  // first Load hook.
  useEffect(() => {
    const getPkmnList = async () => {
      const resp = await listPokemon();

      if(resp.length > 0) {
        setPkmnList(resp);
      }
    }
    getPkmnList();
  }, []);

  // Pokémon list hook.
  useEffect(() => {
    const getPkmnInfo = async () => {
      if (selectedPkmnList != "") {
        const info = await getPokemonInfoByName(selectedPkmnList);       
        setSelectedPkmnInfo(info);

        const description = await getPokemonDescription(selectedPkmnList);
        setPkmnDescription(description);
      }
    }
    getPkmnInfo();
  }, [selectedPkmnList]);

  // selected Pokémon hook.
  useEffect(() => {
    if (selectedPkmnInfo !== "")
      setSrcSprite(selectedPkmnInfo.sprites.other["official-artwork"].front_default)
    else
      setSrcSprite("no_data.png");
    PokemonInfo();

  }, [selectedPkmnInfo]);

  return (
    <div className={styles.pokedex}>
      <div className={styles.topScreen} />
        <div className={styles.screen}>
          <div className={styles.screenCanvas}>
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
              <SpriteScene />
            </Canvas>
          </div>
          <div className={styles.selectBar}>
          <select id={"searchSelect"} className={styles.select} style={{textTransform: "capitalize"}} value={selectedPkmnList} onChange={handlerSearchSelect}>
              <option key={0} value={""}>--</option>
              {pkmnList.length > 0 ? (
                pkmnList.map((item, index) => (
                  <option key={index} value={item.name}>#{index+1} - {item.name}</option>
                ))
              ) : (
                <option value="">No Data Available</option>
              )}
            </select>
        </div>
        </div>
      <div className={styles.searchBar}>
        <input type={"text"} id={"searchText"} placeholder={"Type the name to search"} className={styles.searchText} ref={pkmnSearchBarRef} onChange={(e) => pkmnSearchBarRef.current.value = e.target.value} onKeyDown={handlerOnKeyDownSearchBar} autoComplete="off" /> <button className={styles.searchButton} onClick={handlerSearchButton}>Find</button>
      </div>
      <div className={styles.infoBar} ><PokemonInfo /></div>
      <div className={styles.bottomRow}>
        <Image
            src="/buttons.png"
            width={150}
            height={19}
            alt=""
          />
      </div>
    </div>
  );
};

export default Pokedex;