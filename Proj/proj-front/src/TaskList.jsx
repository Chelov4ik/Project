import { useState } from 'react';

const TaskList = ({ tasks, users = [] }) => { // Устанавливаем пустой массив по умолчанию
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const toggleTaskDetails = (taskId) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId); // Переключаем состояние
  };

  // Функция для получения имен пользователей по их ID
  const getUserNamesByIds = (ids) => { 
    if (!Array.isArray(ids)) return '';
    const assignedUsers = users.filter(user => ids.includes(user.id));  
    return assignedUsers.map(user => user.username).join(', ') || 'Unassigned'; // Если нет пользователей, возвращаем 'Unassigned'
  };

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <div className="text-gray-600">No tasks available.</div>;
  }

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
          <div onClick={() => toggleTaskDetails(task.id)} className="cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="text-gray-500">
              Status: <span className={`font-medium ${task.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>{task.status}</span>
            </p>
          </div>

          {expandedTaskId === task.id && (
            <div className="mt-4">
              {/* Добавляем детальную информацию о задаче */}
              <p className="text-gray-600">{task.description}</p>
              <p className="text-gray-500">Priority: <span className={`font-medium ${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-500' : 'text-gray-500'}`}>{task.priority}</span></p>
              <p className="text-gray-500">Assigned to: {getUserNamesByIds(task.assignedUserIds)}</p>
              <p className="text-gray-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
