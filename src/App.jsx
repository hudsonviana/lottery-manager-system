import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className="container">
      <Outlet />
    </div>
  );
};

export default App;
