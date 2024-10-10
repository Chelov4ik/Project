import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const Sidebar = ({ setCurrentSection }) => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Navigation</h2>
      <ul>
        {(auth?.role === 'admin' || auth?.role === 'manager') && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => setCurrentSection('users')}
          >
            Users
          </li>
        )}
        {auth?.role === 'admin' && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => setCurrentSection('addUser')}
          >
            Add User
          </li>
        )}
        {(auth?.role === 'admin' || auth?.role === 'manager') && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => setCurrentSection('tasks')}
          >
            All Tasks
          </li>
        )}
        {auth?.role === 'worker' && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => setCurrentSection('myTasks')}
          >
            My Tasks
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
