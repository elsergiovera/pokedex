const listPokemon = async () => {
  try{
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const result = await response.json();

    return result.results;
  }
  catch(error){
    console.error("listPokemon: " + error);
    return [];
  }
};

const getPokemonInfoByName = async (name) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const result = await response.json();
    
    return result;
  }
  catch(error) {
    console.error("getPokemonInfoByName: " + error);
    return "";
  }
};

const getPokemonDescription = async (name) => {
  try{
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
    let result = await response.json();

    return result.flavor_text_entries[0].flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' ');
  }
  catch(error){
    console.error("getPokemonInfoById: " + error);
    return [];
  }
};

export {listPokemon, getPokemonInfoByName, getPokemonDescription};