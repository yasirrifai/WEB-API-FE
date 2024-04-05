import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', { username, password });
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      console.log('Registration successful, token stored in localStorage');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="relative h-screen">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("/weatherMap.jpg")' }}></div>
      {/* Register form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 bg-white rounded-md shadow-md">
        <h2 className="text-2xl mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="block w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
