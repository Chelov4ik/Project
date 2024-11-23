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
  const [statusTerm, setStatusTerm] = useState(''); // Для поиска по статусу
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [expandedDepartments, setExpandedDepartments] = useState({});

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    hireDate: '',
    status: '',
    department: '', // Новое поле для отдела
    taskIds: [],
    currentPassword: '', // Для ввода текущего пароля
    newPassword: '', // Для ввода нового пароля
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/api/User/${currentUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data || 'Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUser]);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        birthDate: userData.birthDate || '',
        hireDate: userData.hireDate || '',
        status: userData.status || '',
        department: userData.department || '', // Убедитесь, что отдел заполнен
        taskIds: userData.taskIds || [],
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [userData]);

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
      console.error('Error fetching users from API', error);
      setError('Failed to load users. Please try again later.');
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  let groupedUsers = {};
  if (currentUser.role === 'admin') {
    groupedUsers = users.reduce((acc, user) => {
      const department = user.department ? user.department : 'Other';

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
  } else if (currentUser.role === 'manager') {
    groupedUsers = users.reduce((acc, user) => {
      if (user.department === userData?.department) {
        const department = user.department || 'Other';
        if (!acc[department]) {
          acc[department] = [];
        }
        acc[department].push(user);
      }
      return acc;
    }, {});
  }

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

        const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
        setUsers(updatedUsers);
        setError('');
      } catch (error) {
        console.error('Failed to delete user', error);
        setError('Failed to delete user. Please try again.');
      } finally {
        setSelectedUser(null);
        setDeleteModalOpen(false);
      }
    } else {
      console.error('No user selected for deletion or user ID is missing');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // Проверка на обязательные поля
    if (!updatedUser.username || !updatedUser.firstName || !updatedUser.lastName) {
      setError('All required fields must be completed.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const updatedData = {
        username: updatedUser.username,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        birthDate: updatedUser.birthDate,
        hireDate: updatedUser.hireDate,
        department: updatedUser.department, // Убедитесь, что поле "department" добавлено
        status: updatedUser.status,
        taskIds: updatedUser.taskIds,
        currentPassword: updatedUser.currentPassword || '', // Обязательно проверьте
        newPassword: updatedUser.newPassword || '', // Обязательно проверьте
        profilePicturePath: updatedUser.profilePicturePath || ''
      };
  
      console.log(updatedData);
      // Отправка запроса на сервер
      await API.put(`/api/User/${updatedUser.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Обновление данных пользователей после успешного запроса
      const updatedUsers = users.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsers(updatedUsers);
      setEditModalOpen(false);
      setError('');
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error.response?.data || error.message);
      setError('Не удалось обновить пользователя. Попробуйте снова.');
    }
  };
  

  const toggleDepartment = (department) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [department]: !prev[department],
    }));
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User List</h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="flex mb-4">
        {/* Поле поиска */}
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {/* Выпадающий список для фильтрации по статусу */}
        <select
          value={statusTerm}
          onChange={(e) => setStatusTerm(e.target.value)}
          className="shadow appearance-none border rounded w-1/3 py-2 px-3 ml-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">All Statuses</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="worker">Worker</option>
        </select>
      </div>

      {sortedDepartments.map((department) => {
        const filteredUsers = groupedUsers[department]
          .filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusTerm === "" || user.status === statusTerm)
          );

        if (filteredUsers.length === 0) {
          return null;
        }

        return (
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
                scrollbarGutter: 'stable',
              }}
            >
              {filteredUsers.map((user) => (
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
        );
      })}

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <div className="mb-4">
              <label className="block font-semibold">Username</label>
              <p>{selectedUser.username}</p>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Full Name</label>
              <p>{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Email</label>
              <p>{selectedUser.email}</p>
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Role</label>
              <p>{selectedUser.status}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */} 
      <EditUserModal
        isOpen={isEditModalOpen}
          updatedUser={updatedUser}
          setUpdatedUser={setUpdatedUser}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditModalOpen(false)}
        />
    </div>
  );
};

export default UserList;
