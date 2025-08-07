import React from 'react';
import { Link } from 'react-router-dom';

const Requirements = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Requirements</h1>
        <Link
          to="/requirements/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Add Requirement
        </Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No requirements found.</p>
      </div>
    </div>
  );
};

export default Requirements;