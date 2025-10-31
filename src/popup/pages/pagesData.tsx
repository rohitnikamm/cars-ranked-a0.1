import { routerType } from '../types/router.types';
import AuthPage from './Auth';
import Home from './Home';

const pagesData: routerType[] = [
    {
        path: '',
        element: <Home />,
        title: 'home',
    },
    {
        path: 'auth',
        element: <AuthPage />,
        title: 'auth',
    },
];

export default pagesData;
