import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FriendPage from './pages/FriendPage';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <div className="app dark-theme">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/friend/:id" element={<FriendPage />} />
      </Routes>
    </div>
  );
}

export default App;
