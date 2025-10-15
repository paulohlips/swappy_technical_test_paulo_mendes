import './App.css';
import { Joke } from './components/Joke';
import { useGetRandomJokeQuery } from './services/api';

const App = () => {
  const { data: randomJoke, error: randomJokeError, isLoading: randomJokeLoading } = useGetRandomJokeQuery();
  return (
    <div className="content">
      {randomJoke ? <Joke data={randomJoke} /> : null}
      {randomJokeLoading && (
        <div>Loading...</div>
      )}
      {!randomJokeLoading && !randomJoke || randomJokeError && <div>No joke found, try to refresh the page</div>}
    </div>
  );
};

export default App;
