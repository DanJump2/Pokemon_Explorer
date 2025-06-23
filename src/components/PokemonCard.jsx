import { Link } from 'react-router-dom';

export default function PokemonCard({ pokemon }) {
    return (
        <Link to={`/pokemon/${pokemon.id}`} className="card">
            <h3>{pokemon.name}</h3>
            <img src={pokemon.image} alt={pokemon.name} />
        </Link>
    );
}
