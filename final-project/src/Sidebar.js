import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import { FaUser, FaTasks, FaPlus, FaNewspaper, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ currentSection, setCurrentSection }) => {
  const { auth } = useContext(AuthContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate(); // Хук для навигации

  // Функция для смены секции
  const handleSectionChange = (section) => {
    if (currentSection !== section) {
      setCurrentSection(section);
    }
  };

  const menuItems = [
    { key: 'users', label: 'Workers', icon: <FaUser />, roles: ['admin', 'manager', 'worker'] },
    { key: 'addUser', label: 'Add Worker', icon: <FaPlus />, roles: ['admin'] },
    { key: 'addNews', label: 'Add News', icon: <FaNewspaper />, roles: ['admin'] },
    { key: 'createTask', label: 'Create Task', icon: <FaPlus />, roles: ['admin', 'manager'] },
    { key: 'tasks', label: 'All Tasks', icon: <FaTasks />, roles: ['admin', 'manager'] },
    { key: 'myTasks', label: 'My Tasks', icon: <FaTasks />, roles: ['worker', 'manager'] },
    { key: 'updateUser', label: 'Update Profile', icon: <FaUser />, roles: ['admin', 'manager', 'worker'] },
  ];

  return (
    <div
      className={`z-10 fixed left-0 top-0 h-full bg-gradient-to-b from-blue-700 to-blue-900 text-white transition-all duration-300 ease-in-out ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Верхняя часть */}
      <div
        className="flex items-center bg-blue-800 text-white p-4 shadow-md cursor-pointer"
        onClick={() => handleSectionChange('dashboard')}
      >
        <img src="/Logo.png" alt="MyCompany Logo" className="w-10 h-10" />
        {isExpanded && <span className="ml-2 text-xl font-semibold">MYCompany</span>}
      </div>

      {/* Меню */}
      <div className="p-4">
        <ul className="space-y-4">
          {menuItems
            .filter((item) => item.roles.includes(auth?.role))
            .map((item) => (
              <li
                key={item.key}
                className={`cursor-pointer p-3 rounded-lg flex items-center transition ${
                  currentSection === item.key
                    ? 'bg-blue-600 text-white font-bold shadow-lg'
                    : 'hover:bg-blue-600 hover:text-white'
                }`}
                onClick={() => handleSectionChange(item.key)}
              >
                <span
                  className={`text-xl ${
                    currentSection === item.key ? 'text-white' : 'text-gray-300'
                  } transition`}
                >
                  {item.icon}
                </span>
                {isExpanded && <span className="ml-3">{item.label}</span>}
              </li>
            ))}
        </ul>
      </div>

      {/* Иконка выхода */}
      <div className="absolute bottom-4 left-0 w-full px-4">
        <div
          className="cursor-pointer p-3 rounded-lg flex items-center bg-red-600 hover:bg-red-700 transition"
          onClick={() => navigate(-1)}
        >
          <FaSignOutAlt className="text-xl" />
          {isExpanded && <span className="ml-3">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
