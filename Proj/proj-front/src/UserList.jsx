import { useState, useEffect } from 'react';
import API from './api';

const UserList = ({ currentUser }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await API.get('api/User/all', {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      const data = response.data;
      setUsers(data);
      setError('');
    } catch (error) {
      console.error("Error fetching users from API", error);
      setError('Failed to load users. Please try again later.');
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await API.delete(`api/User/${userToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });

        const updatedUsers = users.filter(user => user.id !== userToDelete.id);
        setUsers(updatedUsers);
        setError('');
      } catch (error) {
        console.error("Failed to delete user", error);
        setError('Failed to delete user. Please try again.');
      } finally {
        setUserToDelete(null);
        setModalOpen(false);
      }
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setModalOpen(false);
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await API.put(`api/User/${userId}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
      setError('');
    } catch (error) {
      console.error("Failed to update user status", error);
      setError('Failed to update user status. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedUsers = {
    admin: filteredUsers.filter(user => user.status === 'admin'),
    manager: filteredUsers.filter(user => user.status === 'manager'),
    worker: filteredUsers.filter(user => user.status === 'worker'),
  };

  const getColorByStatus = (status) => {
    switch (status) {
      case 'admin':
        return 'text-green-500';
      case 'manager':
        return 'text-orange-500';
      case 'worker':
        return 'text-gray-500';
      default:
        return 'text-black';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User List</h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      {Object.keys(groupedUsers).map((role) => (
        groupedUsers[role].length > 0 && (
          <div key={role} className="mb-4">
            <h3 className={`text-xl font-bold ${getColorByStatus(role)}`}>{role.charAt(0).toUpperCase() + role.slice(1)}s</h3>
            <ul className="divide-y divide-gray-200">
              {groupedUsers[role].map((user) => (
                <li key={user.id} className={`flex justify-between items-center py-3 hover:bg-gray-100 transition-colors duration-200`}>
                  <span className={`font-semibold ${getColorByStatus(user.status)}`}>{user.username}</span>
                  <div className="flex items-center space-x-2">
                    {currentUser && currentUser.role === 'admin' && user.id !== currentUser.id && ( // Проверяем, что это не текущий пользователь
                      <>
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className="border rounded p-1"
                        >
                          <option value="worker">Worker</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                          onClick={() => handleDeleteClick(user)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {currentUser && currentUser.role === 'manager' && user.id !== currentUser.id && ( // Убираем кнопки для менеджеров
                      <span className="text-gray-500">No actions available</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Delete User</h2>
            <p className="mb-4">Are you sure you want to delete {userToDelete?.username}?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200 mr-2"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                onClick={confirmDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
