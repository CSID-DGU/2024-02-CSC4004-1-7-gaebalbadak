import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Filter from './pages/Filter';
import Details from './pages/Details';
import NavBarElements from './components/NavBarElements';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <NavBarElements></NavBarElements>

      <Routes>
        <Route path = "/" element = { <Main /> } />
        <Route path = "/Main" element = { <Main /> } />
        <Route path = "/Filter" element = { <Filter /> } />
        <Route path = "/Details" element = { <Details /> } />
      </Routes>
    </Router>

  );
}

export default App;
