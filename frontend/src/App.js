import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Items from './pages/Items';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AddItem from './pages/AddItem';

function App() {
  return (
    <Router>
      {/* <nav>
        <Link to="/">HOME</Link>
        <Link to="/items">BROWSE</Link>
        <Link to="/register">SIGNUP</Link>
        <Link to="/login">LOGIN</Link>
        <Link to="/add-item">UPLOAD</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/" element={<center><h1>p h r e a k y p h r i d a y</h1></center>} /> */}
        <Route path="/items" element={<Items />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-item" element={<PrivateRoute element={<AddItem />} />} />

      </Routes>
    </Router>
  );
}

export default App;
