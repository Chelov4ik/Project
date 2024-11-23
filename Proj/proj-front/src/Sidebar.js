import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { FaUser, FaTasks, FaPlus } from 'react-icons/fa';

const Sidebar = ({ currentSection, setCurrentSection }) => {
  const { auth } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);

  // Функция для смены секции
  const handleSectionChange = (section) => {
    // Проверяем, что секция отличается от текущей, чтобы избежать ненужного обновления
    if (currentSection !== section) {
      setCurrentSection(section);
    }
  };

  return (
    <div
      className={`z-10 fixed left-0 top-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Верхняя белая часть с логотипом и названием компании */}
      <div
        className="flex items-center bg-white text-gray-800 p-2"
        onClick={() => handleSectionChange('dashboard')}
      >
        <img src="/Logo.png" alt="MyCompany Logo" className="w-10 h-10" />
        {isExpanded && <span className="ml-2 text-xl font-semibold">MYCompany</span>}
      </div>

      {/* Темная часть с меню */}
      <div className="p-2">
        <ul>
          {(auth?.role === 'admin' || auth?.role === 'manager') && (
            <li
              className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
              onClick={() => handleSectionChange('users')}
            >
              <FaUser className="text-lg" />
              {isExpanded && <span className="ml-2">Workers</span>}
            </li>
          )}
          {auth?.role === 'admin' && (
            <li
              className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
              onClick={() => handleSectionChange('addUser')}
            >
              <FaPlus className="text-lg" />
              {isExpanded && <span className="ml-2">Add Worker</span>}
            </li>
          )}
          {(auth?.role === 'admin' || auth?.role === 'manager') && (
            <li
              className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
              onClick={() => handleSectionChange('createTask')}
            >
              <FaPlus className="text-lg" />
              {isExpanded && <span className="ml-2">Create Task</span>}
            </li>
          )}
          {(auth?.role === 'admin' || auth?.role === 'manager') && (
            <li
              className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
              onClick={() => handleSectionChange('tasks')}
            >
              <FaTasks className="text-lg" />
              {isExpanded && <span className="ml-2">All Tasks</span>}
            </li>
          )}
          {(auth?.role === 'worker' || auth?.role === 'manager') && (
            <li
              className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
              onClick={() => handleSectionChange('myTasks')}
            >
              <FaTasks className="text-lg" />
              {isExpanded && <span className="ml-2">My Tasks</span>}
            </li>
          )}
          <li
              className="mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded flex items-center"
              onClick={() => handleSectionChange('updateUser')}
            >
              <FaUser className="text-lg" />
              {isExpanded && <span className="ml-2">Update Profile</span>}
            </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
