import { useState, useEffect } from 'react';
import API from './api';
import UserCard from './UserCard'; // Импортируем компонент UserCard
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import EditUserModal from './EditUserModal';

const UserList = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});

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

      setUsers(response.data);
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

  const groupedUsers = users.reduce((acc, user) => {
    const department = user.department || 'Other';
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(user);

    acc[department].sort((a, b) => {
      const roleOrder = { admin: 1, manager: 2, worker: 3 };
      return (roleOrder[a.role] || 4) - (roleOrder[b.role] || 4);
    });
    
    return acc;
  }, {});

  useEffect(() => {
    const allDepartmentsExpanded = Object.keys(groupedUsers).reduce((acc, department) => {
      acc[department] = true;
      return acc;
    }, {});
    setExpandedDepartments(allDepartmentsExpanded);
  }, [users]);

  const sortedDepartments = Object.keys(groupedUsers).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return a.localeCompare(b);
  });

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleEditClick = (user) => {
    setUpdatedUser(user);
    setEditModalOpen(true);
  };
  

  const confirmDelete = async () => {
    if (selectedUser && selectedUser.id) {
      try {
        await API.delete(`api/User/${selectedUser.id}`, {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });

        const updatedUsers = users.filter(user => user.id !== selectedUser.id);
        setUsers(updatedUsers);
        setError('');
      } catch (error) {
        console.error("Failed to delete user", error);
        setError('Failed to delete user. Please try again.');
      } finally {
        setSelectedUser(null);
        setDeleteModalOpen(false);
      }
    } else {
      console.error("No user selected for deletion or user ID is missing");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`api/User/${updatedUser.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });

      if (response.status === 204) {
        const updatedUsers = users.map(user =>
          user.id === updatedUser.id ? updatedUser : user
        );
        setUsers(updatedUsers);
        setError('');
        setEditModalOpen(false);
        setUpdatedUser({});
        setSelectedUser(null);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error("Failed to update user", error);
      setError('Failed to update user. Please try again.');
    }
  };

  const toggleDepartment = (department) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [department]: !prev[department]
    }));
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

      {sortedDepartments.map((department) => (
        <div key={department} className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => toggleDepartment(department)}
          >
            <h3 className="text-xl font-bold text-gray-800">{department}</h3>
            {expandedDepartments[department] ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-500 ease-in-out ${
              expandedDepartments[department] ? 'opacity-100' : 'opacity-0 overflow-hidden'
            }`}
            style={{
              maxHeight: expandedDepartments[department] ? '24rem' : '0',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarGutter: 'stable' // предотвращает изменение ширины при появлении scroll bar
            }}
          >
            {groupedUsers[department]
              .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((user) => (
                <UserCard 
                  key={user.id} 
                  user={user} 
                  currentUser={currentUser}
                  onUserClick={handleUserClick} 
                  onEditClick={handleEditClick} 
                  onDeleteClick={handleDeleteClick}
                />
              ))}
          </div>
        </div>
      ))}

      {/* User Details Modal */} 
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={selectedUser.username}
                className="border rounded w-full py-2 px-3"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Department</label>
              <input
                type="text"
                value={selectedUser.department || 'N/A'}
                className="border rounded w-full py-2 px-3"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <input
                type="text"
                value={selectedUser.status}
                className="border rounded w-full py-2 px-3"
                readOnly
              />
            </div>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <EditUserModal
        isOpen={isEditModalOpen}
        updatedUser={updatedUser}
        setUpdatedUser={setUpdatedUser}
        handleEditSubmit={handleEditSubmit}
        onClose={() => setEditModalOpen(false)}
      />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedUser.username}?</p>
            <div className="flex justify-between mt-4">
              <button 
                onClick={confirmDelete} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setDeleteModalOpen(false)} 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
