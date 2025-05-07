import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/main/main';
import Search from './pages/search/search';
import Info from './pages/info/info';
import Upload from './pages/upload/upload';


function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />
        <Route path="/info" element={<Info />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;