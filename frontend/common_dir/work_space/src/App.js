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
        <Route path="/" element={<Main />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/Filter" element={<Filter />} />
        {/* /Details/:id 경로 추가 ==> detail.js에 id로 동적인 url을 생성하기 위해서는 필수 */} 
        <Route path="/Details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;