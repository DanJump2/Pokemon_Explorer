import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function PokemonDetail() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);

    useEffect(() => {
        async function fetchDetails() {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await res.json();
            setPokemon(data);
        }
        fetchDetails();
    }, [id]);

    if (!pokemon) return <p>Loading...</p>;

    return (
        <div>
            <Link to="/pokedex">← Back to Pokédex</Link>
            <h1 style={{ textTransform: 'capitalize' }}>{pokemon.name}</h1>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p><strong>Height:</strong> {pokemon.height}</p>
            <p><strong>Weight:</strong> {pokemon.weight}</p>
            <p><strong>Abilities:</strong> {pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
        </div>
    );
}
