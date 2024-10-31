// UserDetailsModal.js
import React from 'react';

const UserDetailsModal = ({ isOpen, user, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">User Details</h2>
        <div className="space-y-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Birth Date:</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
          <p><strong>Hire Date:</strong> {new Date(user.hireDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {user.status}</p>
          <p><strong>Department:</strong> {user.department}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetailsModal;
