import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Filter from './pages/Filter';
import Details from './pages/Details';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
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
