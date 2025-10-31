import { HashRouter } from 'react-router';
import './styles/App.css';
import Router from './pages/router';

export default function App() {
    console.log('App loaded');
    return (
        <HashRouter>
            <Router />
        </HashRouter>
    );
}
