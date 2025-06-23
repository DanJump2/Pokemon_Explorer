import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function PokemonDetail() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [error, setError] = useState(null);
    const { theme, toggleTheme } = useContext(ThemeContext);

    useEffect(() => {
        async function fetchDetails() {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                if (!res.ok) throw new Error("Pokémon not found");
                const data = await res.json();
                setPokemon(data);
            } catch (err) {
                setError(err.message);
            }
        }

        fetchDetails();
    }, [id]);

    if (error) return <p>{error}</p>;
    if (!pokemon) return <p>Loading...</p>;

    return (
        <div className={theme}>
            <button onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>

            <Link to="/pokedex">
                <button>← Back to Pokédex</button>
            </Link>

            <h1 style={{ textTransform: 'capitalize' }}>{pokemon.name}</h1>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />

            <p><strong>Height:</strong> {pokemon.height}</p>
            <p><strong>Weight:</strong> {pokemon.weight}</p>
            <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(', ')}</p>
            <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
            <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>

            <h3>Stats</h3>
            <ul>
                {pokemon.stats.map((stat, index) => (
                    <li key={index}>
                        {stat.stat.name}: {stat.base_stat}
                    </li>
                ))}
            </ul>
        </div>
    );
}
