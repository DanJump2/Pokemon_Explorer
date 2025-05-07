import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import PokemonCard from '../components/PokemonCard';
import '../App.css';

export default function Pokedex() {
    const [pokemonList, setPokemonList] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [allPokemonList, setAllPokemonList] = useState([]);
    const [searchResult, setSearchResult] = useState(null);

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
                        id: details.id,
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

    useEffect(() => {
        async function fetchAllPokemonNames() {
            try {
                const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
                const data = await res.json();
                setAllPokemonList(data.results);
            } catch (err) {
                console.error('Failed to load full Pokémon list');
            }
        }
        fetchAllPokemonNames();
    }, []);

    async function handleSearch(e) {
        e.preventDefault();
        const match = allPokemonList.find(p => p.name === searchQuery.toLowerCase());
        if (!match) {
            setError('No Pokémon found.');
            setSearchResult(null);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${match.name}`);
            const details = await res.json();
            setSearchResult({
                id: details.id,
                name: details.name,
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
            });
            setError(null);
        } catch {
            setError('Error fetching Pokémon details.');
        }
        setLoading(false);
    }

    return (
        <div className={theme}>
            <h1>Pokédex</h1>

            <button onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>

            <Link to="/">
                <button>← Back to Home</button>
            </Link>

            <form onSubmit={handleSearch} style={{ margin: '1rem 0' }}>
                <input
                    type="text"
                    placeholder="Search any Pokémon by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.5rem', width: '70%' }}
                />
                <button type="submit" style={{ marginLeft: '0.5rem' }}>Search</button>
            </form>

            {searchResult && (
                <div className="card-grid">
                    <PokemonCard key={searchResult.id} pokemon={searchResult} />
                </div>
            )}

            <div className="card-grid">
                {pokemonList.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            <button onClick={() => setOffset(offset + 20)}>Load More</button>
        </div>
    );
}
