import React, { useEffect, useState } from "react";
import Image from 'next/image'
import styles from '@/styles/Pokedex.module.css'
import { listPokemon, getPokemonInfo } from "./api/pokeapi";

const Pokedex = () => {
  // variables.
  const [pkmnList, setPkmnList] = useState([]);
  const [selectedPkmnList, setSelectedPkmnList] = useState("");
  const [selectedPkmnInfo, setSelectedPkmnInfo] = useState("");

  // handlers.
  const handlerPkmnList = (event) => {
    setSelectedPkmnList(event.target.value);
  };

  // first hook.
  useEffect(() => {
    const getPkmnList = async () => {
      const resp = await listPokemon();

      if(resp.length > 0) {
        setPkmnList(resp);
        setSelectedPkmnList(resp[0].url);
      }
    }
    getPkmnList();
  }, []);

  // pokemon list hook.
  useEffect(() => {
    const getPkmnInfo = async () => {
      if (selectedPkmnList != "") {
        const resp = await getPokemonInfo(selectedPkmnList);
        
        setSelectedPkmnInfo(resp);
      }
    }
    getPkmnInfo();
  }, [selectedPkmnList]);

  // selected Pokémon hook.
  useEffect(() => {
    // console.log(selectedPkmnInfo.sprites.other);
    // console.log(selectedPkmnInfo['sprites']['other']['official-artwork']);

    // let sprites = selectedPkmnInfo.sprites;
    // console.log(sprites.other["official-artwork"].front_default);

    // if(selectedPkmnInfo != "") {
    //   setSelectedPokemon();
    // }


  }, [selectedPkmnInfo]);

  return (
    <div className={styles.pokedex}>
      <div className={styles.pokedex.topRow}>
        <div className={styles.topCircleContainer}>
          <div className={styles.cyanCircle}></div>
          <div className={styles.smallRedCircle}></div>
          <div className={styles.smallYellowCircle}></div>
          <div className={styles.smallGreenCircle}></div>
        </div>
      </div>
      <div className={styles.middleRow}>
        <div className={styles.screen}>
          <Image
            src={selectedPkmnInfo != "" ? selectedPkmnInfo.sprites.other["official-artwork"].front_default : ""}
            height={300}
            width={300}
            alt=""
          />
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.bottomMiddle}>
          <select id="PkmnList" className={styles.select} style={{textTransform: "capitalize"}} onChange={handlerPkmnList}>
            {pkmnList.map((item, index) => (
              <option key={index} value={item.url}>{index+1} - {item.name}</option>
            ))}
          </select>
        </div>      
      </div>
    </div>
  );
}

export default Pokedex;