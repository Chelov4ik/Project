import { useState } from 'react';
import AddUserForm from './AddUserForm'; // Импортируем новый компонент

const UserList = ({ users, onDelete, onAdd }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const admins = users.filter(user => user.status === 'admin');
  const managers = users.filter(user => user.status === 'manager');
  const workers = users.filter(user => user.status === 'worker');

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setUserToDelete(null);
      setModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
    setModalOpen(false);
  };

  const handleAddUser = (newUser) => {
    onAdd(newUser);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User List</h2>

      {/* Добавляем форму только для админа */}
      {admins.length > 0 && (
        <AddUserForm onAddUser={handleAddUser} />
      )}

      {admins.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-green-600">Admins</h3>
          <ul className="divide-y divide-gray-200">
            {admins.map((user) => (
              <li key={user.id} className="flex justify-between items-center py-3 hover:bg-gray-100 transition-colors duration-200">
                <span className="font-semibold text-gray-700">{user.username}</span>
                <button 
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleDeleteClick(user)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {managers.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-blue-600">Managers</h3>
          <ul className="divide-y divide-gray-200">
            {managers.map((user) => (
              <li key={user.id} className="flex justify-between items-center py-3 hover:bg-gray-100 transition-colors duration-200">
                <span className="font-semibold text-gray-700">{user.username}</span>
                <button 
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleDeleteClick(user)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {workers.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-600">Workers</h3>
          <ul className="divide-y divide-gray-200">
            {workers.map((user) => (
              <li key={user.id} className="flex justify-between items-center py-3 hover:bg-gray-100 transition-colors duration-200">
                <span className="font-semibold text-gray-700">{user.username}</span>
                <button 
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                  onClick={() => handleDeleteClick(user)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
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
