import { Route, Routes } from 'react-router-dom';
import { PageLanding } from './components/pages/PageLanding';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PageLanding />} />
    </Routes>
  );
}

export default App;
