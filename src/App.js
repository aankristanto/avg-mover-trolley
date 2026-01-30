import { Route, Routes } from 'react-router-dom';
import DefaultPage from './pages/DefaultPage';
import RequestEmptyTrolleyPage from './pages/RequestEmptyTrolleyPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultPage />} />
      <Route path="/req-empty-trolley" element={<RequestEmptyTrolleyPage />} />
    </Routes>
  );
}

export default App;
