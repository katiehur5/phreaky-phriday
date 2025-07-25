import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element}) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if token exists

  return isAuthenticated ? element : <Navigate to='/login' />;
};

export default PrivateRoute;
