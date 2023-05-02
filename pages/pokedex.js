import React, { useEffect, useState } from "react";
import Image from 'next/image'
import styles from '@/styles/Pokedex.module.css'
import { listPokemon, getPokemonInfoByName, getPokemonDescription } from "./api/pokeapi";

const Pokedex = () => {
  // variables.
  const [pkmnList, setPkmnList] = useState([]);
  const [selectedPkmnList, setSelectedPkmnList] = useState("");
  const [selectedPkmnSearchBar, setSelectedPkmnSearchBar] = useState("");
  const [selectedPkmnInfo, setSelectedPkmnInfo] = useState("");
  const [selectedPkmnDescription, setPkmnDescription] = useState("");

  // functions
  const PokemonInfo = () => {
    let info = "";

    if(selectedPkmnInfo != "") {
      info = 
      "<strong>Height:</strong> " + selectedPkmnInfo.height * 10 + " cms.<br>" +
      "<strong>Weight:</strong> " + selectedPkmnInfo.weight / 10 + " kgs.<br>" +
      "<strong>Types:</strong> ";
      selectedPkmnInfo.types.map((item, index) => (
        info = info + item.type.name + (selectedPkmnInfo.types.length-1 === index ? "<br>" : ", ")
      ))
      info = info + "<strong>Description:</strong> " + selectedPkmnDescription;
    }
    else
      info = "<strong>No data</strong>"

    return (
      <div dangerouslySetInnerHTML={{ __html: info }} />
    );
  }

  // handlers for Search Bar and Select.
  const handlerSearchSelect = (event) => {
    setSelectedPkmnList(event.target.value);
    setSelectedPkmnSearchBar("");
  };
  const handlerSearchBar = (event) => {
      setSelectedPkmnSearchBar(event.target.value);
  };
  const handlerOnKeyDownSearchBar = (event) => {
    console.log(event.target.keyCode);
    if (event.key === "Enter") {
      handlerSearchButton();
      setSelectedPkmnSearchBar(event.target.value);
    }
  }
  // hanlder for Search Button.
  const handlerSearchButton = () => {
    const getPkmnInfo = async () => {
      if (selectedPkmnSearchBar != "") {
        const info = await getPokemonInfoByName(selectedPkmnSearchBar);       
        setSelectedPkmnInfo(info);

        const description = await getPokemonDescription(selectedPkmnSearchBar); 
        setPkmnDescription(description);

        setSelectedPkmnList(selectedPkmnSearchBar);
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
    PokemonInfo();
  }, [selectedPkmnInfo]);

  return (
    <div className={styles.pokedex}>
      <div className={styles.topScreen} />
      <div className={styles.screen}>
        <Image
          src={selectedPkmnInfo != "" ? selectedPkmnInfo.sprites.other["official-artwork"].front_default : "/no_data.png"}
          width={220}
          height={220}
          alt=""
        />
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
      <input type={"text"} id={"searchText"} placeholder={"Type the name to search"} className={styles.searchText} value={selectedPkmnSearchBar} onChange={handlerSearchBar} onKeyDown={handlerOnKeyDownSearchBar} autoComplete="off" /> <button className={styles.searchButton} onClick={handlerSearchButton}>Find</button>
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
}

export default Pokedex;