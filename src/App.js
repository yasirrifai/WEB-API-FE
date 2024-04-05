import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import WeatherMap from './components/WeatherMap'; 

function App() {
 const isAuthenticated = localStorage.getItem('authToken') ? true : false;

 return (
    <Router>
      <Routes>
      <Route path="/weather-map" element={isAuthenticated ? <WeatherMap /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Navigate to="/weather-map" />} />
      </Routes>
    </Router>
 );
}

export default App;
