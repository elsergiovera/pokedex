import React, { useState, useEffect, useRef } from "react";
import Image from 'next/image'
// import SpriteScene from "./components/sprites";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from '@react-three/drei';
import { TextureLoader } from "three";
import { listPokemon, getPokemonInfoByName, getPokemonDescription } from "../data/pokeapi";
import styles from "@/styles/Pokedex.module.css";

const Pokedex = () => {
  // variables.
  const pkmnSearchBarRef = useRef();
  const [pkmnList, setPkmnList] = useState([]);
  const [selPkmn, setSelPkmn] = useState("");
  const [pkmnData, setPkmnData] = useState("");
  const [pkmnDataDescription, setPkmnDataDescription] = useState("");
  const [srcFrontSprite, setSrcFrontSprite] = useState("");
  
  // const cameraRef = useRef();
  // const controlsRef = useRef();
  // const handleMouseMove = (event) => {
  //   const controls = controlsRef.current;
  //   const canvas = event.target;

  //   if (controls && canvas) {
  //     const { clientWidth, clientHeight } = canvas;
  //     const { movementX, movementY } = event;

  //     controls.target.x -= movementX / clientWidth;
  //     controls.target.y += movementY / clientHeight;
  //   }
  // };

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
    
    // useFrame(() => {
    //   const controls = controlsRef.current;
    //   const camera = cameraRef.current;
  
    //   if (controls && camera) {
    //     camera.position.x = controls.target.x + Math.sin(Date.now() / 2000) * 2;
    //     camera.position.y = controls.target.y + Math.sin(Date.now() / 2000) * 2;
    //     camera.lookAt(controls.target);
    //   }
    // });
  };
  const PokemonInfo = () => {
    let info = "";

    if(pkmnData != "") {
      // set Info.
      info = 
      "<strong>Height:</strong> " + pkmnData.height * 10 + " cms.<br>" +
      "<strong>Weight:</strong> " + pkmnData.weight / 10 + " kgs.<br>" +
      "<strong>Types:</strong> ";
      pkmnData.types.map((item, index) => (
        info = info + item.type.name + (pkmnData.types.length-1 === index ? "<br>" : ", ")
      ))
      info = info + "<strong>Description:</strong> " + pkmnDataDescription;
    }
    else {
      info = "<strong>No data</strong>";
    }

    return (
      <div dangerouslySetInnerHTML={{ __html: info }} />
    );
  };

  // handlers for Search Bar, Button and Select.
  const handlerSearchSelect = (event) => {
    setSelPkmn(event.target.value);
    pkmnSearchBarRef.current.value = "";
  };
  const handlerOnKeyDownSearchBar = (event) => {
    if (event.key === "Enter") {
      handlerSearchButton();
      pkmnSearchBarRef.current.value = event.target.value;
    }
  };
  const handlerSearchButton = () => {
    const getPkmnInfo = async () => {
      if (pkmnSearchBarRef.current.value != "") {
        const info = await getPokemonInfoByName(pkmnSearchBarRef.current.value);       
        setPkmnData(info);

        if(info != "") {
          const description = await getPokemonDescription(pkmnSearchBarRef.current.value); 
          setPkmnDataDescription(description);
        }
        else
          setPkmnDataDescription("");

        setSelPkmn(pkmnSearchBarRef.current.value);
      }
      else
        setPkmnData("");
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
      if (selPkmn != "") {
        const info = await getPokemonInfoByName(selPkmn);       
        setPkmnData(info);

        const description = await getPokemonDescription(selPkmn);
        setPkmnDataDescription(description);
      }
      else {
        setSelPkmn("");
        setPkmnData("");
        setPkmnDataDescription("");
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
      <div className={styles.topScreen} />
        <div className={styles.screen}>
          <div className={styles.screenCanvas}>
            <Canvas
              // onMouseMove={handleMouseMove}
              style={{ border: "10px solid #2d2b2c", backgroundColor: "#4fa95f" }}
              shadows="soft"
              camera={{
                fov: 75,
                near: 0.1,
                far: 1000,
                position: [0, 0, 1]
              }}
            >
              {/* <perspectiveCamera
                ref={cameraRef}
                position={[0, 0, 10]} /> */}
              <SpriteScene />
              <OrbitControls
                // ref={controlsRef}
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
          <div className={styles.selectBar}>
          <select
            id={"searchSelect"}
            className={styles.select}
            style={{textTransform: "capitalize"}}
            value={selPkmn}
            onChange={handlerSearchSelect}>
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
        <input
          type={"text"}
          id={"searchText"}
          placeholder={"Type the name to search"}
          className={styles.searchText}
          ref={pkmnSearchBarRef} onChange={(e) => pkmnSearchBarRef.current.value = e.target.value}
          onKeyDown={handlerOnKeyDownSearchBar}
          autoComplete="off"
          list={"PkmnList"} />
          &nbsp;
          <button
            className={styles.searchButton}
            onClick={handlerSearchButton}>
            Find
          </button>
        {/* <datalist id={"PkmnList"}>
            {(pkmnList.length > 0) ? (
              pkmnList.map((item, index) => (
                <option key={index} value={item.name}>{`#${index+1} - ${item.name}`}</option>
              ))
            ) : (<></>)}
        </datalist> */}
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