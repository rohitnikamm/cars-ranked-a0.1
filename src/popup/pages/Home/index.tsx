import HelloWorld from '@/components/HelloWorld';

const Home = () => {
    console.log('Home component rendered');
    return (
        <div>
            <HelloWorld msg='Vite + React + CRXJS' />
        </div>
    );
};

export default Home;
