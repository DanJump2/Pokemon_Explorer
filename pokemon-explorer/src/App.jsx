// src/App.jsx
import { useState, useEffect, useContext } from 'react';
import './App.css';
import PokemonCard from './components/PokemonCard';
import Modal from './components/Modal';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetchPokemon();
  }, [offset]);

  async function fetchPokemon() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const data = await res.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (p) => {
          const res = await fetch(p.url);
          const details = await res.json();
          return {
            name: p.name,
            image: details.sprites.front_default,
            height: details.height,
            weight: details.weight,
            types: details.types.map((t) => t.type.name).join(', '),
            abilities: details.abilities.map((a) => a.ability.name).join(', '),
            base_experience: details.base_experience,
            stats: details.stats.map((s) => ({
              name: s.stat.name,
              value: s.base_stat,
            })),
          };
        })
      );

      setPokemonList((prev) => [...prev, ...detailedPokemon]);
    } catch (err) {
      setError('Failed to fetch Pokémon.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h1>Pokémon Explorer</h1>

      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      <div className="card-grid">
        {pokemonList.map((pokemon, i) => (
          <PokemonCard key={i} pokemon={pokemon} onClick={() => setSelectedPokemon(pokemon)} />
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <button onClick={() => setOffset(offset + 20)}>Load More</button>

      {selectedPokemon && (
        <Modal onClose={() => setSelectedPokemon(null)}>
          <h2 style={{ textTransform: 'capitalize' }}>{selectedPokemon.name}</h2>
          <img src={selectedPokemon.image} alt={selectedPokemon.name} />
          <p><strong>Height:</strong> {selectedPokemon.height}</p>
          <p><strong>Weight:</strong> {selectedPokemon.weight}</p>
          <p><strong>Types:</strong> {selectedPokemon.types}</p>
          <p><strong>Abilities:</strong> {selectedPokemon.abilities}</p>
          <p><strong>Base Experience:</strong> {selectedPokemon.base_experience}</p>

          <h3>Stats</h3>
          <ul>
            {selectedPokemon.stats.map((stat, index) => (
              <li key={index}>
                {stat.name}: {stat.value}
              </li>
            ))}
          </ul>
        </Modal>
      )}
    </div>
  );
}

export default App;
