// src/components/ProtectedRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { username } = useSelector((state) => state.user.payload || {});
    return username ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
