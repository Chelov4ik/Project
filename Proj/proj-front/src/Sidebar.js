import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { FaUser, FaTasks, FaPlus } from 'react-icons/fa';

const Sidebar = ({ setCurrentSection }) => {
  const { auth } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`z-10 fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-16'}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Верхняя белая часть с логотипом и названием компании */}
      <div className="flex items-center bg-white text-gray-800 p-2" onClick={() => setCurrentSection('dashboard')}>
        <img src={"/Logo.png"} alt="MyCompany Logo" className="w-10 h-10" />
        {isExpanded && <span className="ml-2 text-xl font-semibold">MYCompany</span>}
      </div>


      {/* Темная часть с меню */}
      <div className="p-2">
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
              onClick={() => setCurrentSection('createTask')}
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
    </div>
  );
};

export default Sidebar;
