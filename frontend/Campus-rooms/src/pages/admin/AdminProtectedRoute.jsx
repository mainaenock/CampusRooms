
import React from 'react';

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  const payload = parseJwt(token);
  if (!payload || payload.role !== 'admin') {
    window.location.href = '/login';
    return null;
  }
  return children;
};

export default AdminProtectedRoute;
