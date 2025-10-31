import Logo from '@/assets/crx.svg';
import { useState, useEffect } from 'react';
import './App.css';
import { waitForElementText } from '../helpers/domWatch';

function useScore(selector: string, timeout = 15_000) {
    const [score, setScore] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const text = await waitForElementText(
                selector,
                (t) => t.endsWith('%') || t.trim() !== '',
                { timeout } // use options object
            );
            if (!cancelled) setScore(text ?? 'Timed out');
        })();

        return () => {
            cancelled = true;
        };
    }, [selector, timeout]);

    return score;
}

function App() {
    const [show, setShow] = useState(false);
    const score = useScore('.chart-text.percent', 15_000);

    return (
        <div className='popup-container'>
            {show && (
                <div
                    className={`popup-content ${
                        show ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <h1>{score ?? 'Waiting for score...'}</h1>
                </div>
            )}

            <button
                className='toggle-button'
                onClick={() => setShow((s) => !s)}
            >
                <img src={Logo} alt='CRXJS logo' className='button-icon' />
            </button>
        </div>
    );
}

export default App;
