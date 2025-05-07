import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function Home() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <main className={theme}>
            <h1>Welcome to the Pokémon Explorer</h1>

            <button onClick={toggleTheme}>
                Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
            </button>

            <p>Catch them all in the Pokédex!</p>

            <Link to="/pokedex">
                <button>Go to Pokédex</button>
            </Link>
        </main>
    );
}
