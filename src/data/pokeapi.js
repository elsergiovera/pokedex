const getPokemonList = async () => {
  try{
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    const result = await response.json();

    const results = result.results.map((pkmn) => {
      return pkmn.name.charAt(0).toUpperCase() + pkmn.name.slice(1);
    })

    return results;
  }
  catch(error){
    console.error("listPokemon: " + error);
    return [];
  }
};

const getPokemonData = async (name) => {
  try {
    const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const info = await response1.json();

    const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    const description = await response2.json();

    let en_description = "";
    description.flavor_text_entries.map((entry) => {
      if (entry.language.name === "en")
      en_description = entry.flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' ');
    })

    const result = ({
      name: info.name,
      height: info.height,
      weight: info.weight,
      types: info.types,
      sprites: info.sprites,
      description: en_description,
      generation: description.generation.name.toUpperCase()
    })
    
    return result;
  }
  catch(error) {
    console.error("getPokemonInfoByName: " + error);
    return "";
  }
};

export { getPokemonList, getPokemonData };