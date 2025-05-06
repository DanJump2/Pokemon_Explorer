export default function PokemonCard({ pokemon, onClick }) {
    return (
        <div className="card" onClick={onClick}>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.image} alt={pokemon.name} />
        </div>
    );
}
