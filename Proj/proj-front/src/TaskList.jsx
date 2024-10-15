import { useState } from 'react';

// Компонент модального окна
const Modal = ({ isOpen, onClose, task, users }) => {
  if (!isOpen || !task) return null;

  // Функция для получения имен пользователей по их ID
  const getUserNamesByIds = (ids) => {
    if (!Array.isArray(ids)) return '';
    const assignedUsers = users.filter(user => ids.includes(user.id));
    return assignedUsers.map(user => user.username).join(', ') || 'Unassigned';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="mt-2">{task.description}</p>
        <p className="text-gray-500">
          Priority: <span className={`font-medium ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-500' : task.priority === 'Low' ? 'text-green-600' : 'text-gray-600'}`}>{task.priority}</span>
        </p>
        <p className="text-gray-500">Assigned to: {getUserNamesByIds(task.assignedUserIds)}</p>
        <p className="text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300">Close</button>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, users = [] }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const toggleTaskDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true); // Открываем модальное окно
  };

  // Фильтрация задач по имени и приоритету
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const priorities = ['All', 'High', 'Medium', 'Low'];

  // Группировка задач по приоритету
  const groupedTasks = priorities.reduce((acc, priority) => {
    acc[priority] = filteredTasks.filter(task => task.priority === priority);
    return acc;
  }, {});

  // Добавление группы для других приоритетов
  const otherTasks = filteredTasks.filter(task => !priorities.includes(task.priority));

  // Функция для получения цвета статуса
  const getStatusColor = (status) => {
    switch (status) {
      case 'Issued':
        return 'bg-blue-500'; // Выберите подходящий цвет для Issued
      case 'InProgress':
        return 'bg-yellow-500'; // Желтый
      case 'Completed':
        return 'bg-green-500'; // Зеленый
      case 'NotCompleted':
        return 'bg-red-500'; // Красный
      default:
        return 'bg-gray-500'; // Серый для других статусов
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';  
      case 'Medium':
        return 'bg-yellow-500';  
      case 'Low':
        return 'bg-blue-500';  
      default:
        return 'bg-gray-500'; // Серый для других статусов
    }
  };

  return (
    <>
      <div className="mb-4 flex">
        <input 
          type="text" 
          placeholder="Search tasks..." 
          className="border rounded px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <select 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)} 
          className="ml-2 border rounded px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          {priorities.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
      </div>

      {Object.keys(groupedTasks).length === 0 || Object.values(groupedTasks).every(group => group.length === 0) ? (
        <div className="text-gray-600">No tasks available.</div>
      ) : (
        <>
          {priorities.slice(1).map(priority => (  
            groupedTasks[priority].length > 0 && (
              <div key={priority} className="mb-6">
                <h2 className={`text-xl font-semibold mb-2 ${getPriorityColor(priority)} text-white p-2 rounded`}>{priority} Priority</h2>
                <ul className="space-y-4">
                  {groupedTasks[priority].map((task) => (
                    <li key={task.id} className="flex bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className={`w-2 ${getStatusColor(task.status)}`} /> {/* Цветная панель слева */}
                      <div className="p-4 flex-1">
                        <div onClick={() => toggleTaskDetails(task)} className="cursor-pointer">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <p className="text-gray-500">
                            Status: <span>{task.status}</span>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
          
          {/* Раздел для других приоритетов */}
          {otherTasks.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-xl font-semibold mb-2 ${getPriorityColor("Other")} text-white p-2 rounded`}>Other Priority</h2>
              <ul className="space-y-4">
                {otherTasks.map((task) => (
                  <li key={task.id} className="flex bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className={`w-2 ${getStatusColor(task.status)}`} /> {/* Цветная панель слева */}
                    <div className="p-4 flex-1">
                      <div onClick={() => toggleTaskDetails(task)} className="cursor-pointer">
                        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                        <p className="text-gray-500">
                          Status: <span>{task.status}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={selectedTask} users={users} />
    </>
  );
};

export default TaskList;
