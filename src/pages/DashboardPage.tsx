import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import UserDashboard from '../components/UserDashboard';

const DashboardPage: React.FC = () => {
  const { user, orders, logout, updateProfile, addAddress, updateAddress, deleteAddress, isAuthenticated } = useUser();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <UserDashboard
      user={user}
      orders={orders}
      onLogout={logout}
      onUpdateProfile={updateProfile}
      onAddAddress={addAddress}
      onUpdateAddress={updateAddress}
      onDeleteAddress={deleteAddress}
    />
  );
};

export default DashboardPage;
