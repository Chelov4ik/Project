import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { FaUser, FaTasks, FaPlus } from 'react-icons/fa'; // Импортируем иконки

const Sidebar = ({ setCurrentSection }) => {
  const { auth } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false); // Состояние для управления шириной

  return (
    <div
      className={`  z-10 fixed left-0 top-0 h-full bg-gray-800 text-white p-2 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)} // Раскрываем при наведении
      onMouseLeave={() => setIsExpanded(false)} // Скрываем при уходе мыши
    > 
      <ul>
        {(auth?.role === 'admin' || auth?.role === 'manager') && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
            onClick={() => setCurrentSection('users')}
          >
            <FaUser className="text-lg" />
            {isExpanded && <span className="ml-2">Users</span>}
          </li>
        )}
        {auth?.role === 'admin' && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
            onClick={() => setCurrentSection('addUser')}
          >
            <FaPlus className="text-lg" />
            {isExpanded && <span className="ml-2">Add User</span>}
          </li>
        )}
        {(auth?.role === 'admin' || auth?.role === 'manager') && (
  <li
    className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
    onClick={() => setCurrentSection('createTask')} // Переход на CreateTask
  >
    <FaPlus className="text-lg" />
    {isExpanded && <span className="ml-2">Create Task</span>}
  </li>
)}


        {(auth?.role === 'admin' || auth?.role === 'manager') && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
            onClick={() => setCurrentSection('tasks')}
          >
            <FaTasks className="text-lg" />
            {isExpanded && <span className="ml-2">All Tasks</span>}
          </li>
        )}
        {(auth?.role === 'worker' || auth?.role === 'manager') && (
          <li
            className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
            onClick={() => setCurrentSection('myTasks')}
          >
            <FaTasks className="text-lg" />
            {isExpanded && <span className="ml-2">My Tasks</span>}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
