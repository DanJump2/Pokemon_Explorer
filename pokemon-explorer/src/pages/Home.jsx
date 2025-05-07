import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <main>
            <h1>Welcome to Pokémon Explorer</h1>
            <p>Catch 'em all!</p>
            <Link to="/pokedex">Go to Pokédex</Link>
        </main>
    );
}
