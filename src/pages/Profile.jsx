import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {user?.name || 'N/A'}</p>
          <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;