import React from 'react';

const Quotes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500">No quotes found.</p>
      </div>
    </div>
  );
};

export default Quotes;