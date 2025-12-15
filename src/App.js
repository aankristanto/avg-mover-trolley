import { Route, Routes } from 'react-router-dom';
import DefaultPage from './components/pages/DefaultPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultPage />} />
    </Routes>
  );
}

export default App;
