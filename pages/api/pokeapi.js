const listPokemon = async () => {
  try{
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const result = await response.json();

    return result.results;
  }
  catch(err){
    console.error(err);
    return [];
  }
};

const getPokemonInfo = async (url) => {
  try{
    const response = await fetch(`${url}`);
    const result = await response.json();

    return result;
  }
  catch(err){
    console.error(err);
    return [];
  }
};

export {listPokemon, getPokemonInfo};