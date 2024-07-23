import { useState } from 'react';
import './App.css';
import api from './api/api';

function App() {
  const [count, setCount] = useState(0);
  const backendConnect = () => {
    const params = { connect: 'success' };
    api
      .get('hello/', { params })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => backendConnect()}>Connect</button>
      </div>
    </>
  );
}

export default App;
