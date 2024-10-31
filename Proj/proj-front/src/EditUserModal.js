import React from 'react';

const EditUserModal = ({
  isOpen,
  updatedUser,
  setUpdatedUser,
  handleEditSubmit,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">Edit User</h2>

        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={updatedUser.username}
            onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            value={updatedUser.firstName}
            onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            value={updatedUser.lastName}
            onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        {/* Department */}
        <div className="mb-4">
          <label className="block text-gray-700">Department</label>
          <input
            type="text"
            value={updatedUser.department || 'N/A'}
            onChange={(e) => setUpdatedUser({ ...updatedUser, department: e.target.value })}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={updatedUser.status}
            onChange={(e) => setUpdatedUser({ ...updatedUser, status: e.target.value })}
            className="border rounded w-full py-2 px-3"
            required
          >
            <option value="worker">Worker</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserModal;
