import React from 'react';
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Items from './pages/Items';
import Register from './pages/Register';
import EnterCloset from './pages/EnterCloset';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import ItemDetail from './pages/ItemDetail';
import ScrollToTop from './components/ScrollToTop';
import Welcome from './pages/Welcome';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


function App() {
  return (
    <>
    <Router>
      <ScrollToTop />
      {/* <nav>
        <Link to="/">HOME</Link>
        <Link to="/items">BROWSE</Link>
        <Link to="/register">SIGNUP</Link>
        <Link to="/login">LOGIN</Link>
        <Link to="/add-item">UPLOAD</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={
          <PrivateRoute 
            element={<Home />} />
        } />
        <Route path="/items" element={
          <PrivateRoute 
            element={<Items />} />
        }/>
        <Route path="/register" element={<Register />} />
        <Route path="/enter" element={<EnterCloset />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-item" element={
          <PrivateRoute 
            element={<AddItem />} />
        } />
        <Route path="/profile/:userId" element={
          <PrivateRoute 
            element={<Profile />} />
        } />
        <Route path="/items/:id/" element={
          <PrivateRoute 
            element={<ItemDetail />} />
        }/>
      </Routes>
    </Router>

    <Analytics />
    </>
  );
}

export default App;
