import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main/main';
import Search from './pages/search/search';


function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;