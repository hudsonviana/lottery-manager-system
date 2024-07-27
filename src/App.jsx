import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const fetchTeste = async () => {
      try {
        const resp = await fetch('http://localhost:3333/api');
        const data = await resp.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTeste();
  }, []);

  return (
    <div>
      <h1>Teste API</h1>
    </div>
  );
};

export default App;
