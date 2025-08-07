import React from 'react';
import { useParams } from 'react-router-dom';

const ViewRequirement = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">View Requirement #{id}</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">Requirement details will be displayed here.</p>
      </div>
    </div>
  );
};

export default ViewRequirement;