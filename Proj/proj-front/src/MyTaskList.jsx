import { useState } from 'react';
import EditTaskModal from './EditTaskModal';
import ViewTaskModal from './ViewTaskModal';
import API from './api';
import './TaskList.css';

// Основной компонент TaskList
const MyTaskList = ({ initialTasks, users = [] }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Для просмотра задачи
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Для редактирования задачи
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [collapsedPriorities, setCollapsedPriorities] = useState({});
  const [showCompletedTasks, setShowCompletedTasks] = useState(false); // Состояние для отображения завершенных задач
 

  const toggleTaskDetails = (task) => {
    setSelectedTask(task); // Сохраняем выбранную задачу
    setIsViewModalOpen(true);  // Открываем модальное окно
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);  
    setIsEditModalOpen(true);  
  };

  const handleDoneTask = (task) => { 
    if(task.status == "Completed") 
      {
        if(task.progressPercentage == 0)
          {
            task.status = "NotCompleted";
          }
          else{
            task.status = "InProgress";
          }
      }
    else{ task.status = "Completed" }  
    handleSaveTask(task); 
  };


  const togglePriorityCollapse = (priority) => {
    setCollapsedPriorities((prevState) => ({
      ...prevState,
      [priority]: !prevState[priority],
    }));
  };



  // Фильтрация задач
  const filteredTasks = (tasks || []).filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority && task.status !== 'Completed'; // Исключаем завершенные задачи
  });

  const priorities = ['All', 'High', 'Medium', 'Low'];
  const groupedTasks = priorities.reduce((acc, priority) => {
    acc[priority] = filteredTasks.filter(task => task.priority === priority);
    return acc;
  }, {});

  // Группировка завершенных задач
  const completedTasks = tasks.filter(task => task.status === 'Completed');
 

  const getStatusColor = (status) => {
    switch (status) {
      case 'Issued':
        return 'bg-blue-500';
      case 'InProgress':
        return 'bg-yellow-500';
      case 'Completed':
        return 'bg-gray-500'; // Цвет для завершенных задач
      case 'NotCompleted':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
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
        return 'bg-gray-500';
    }
  };

  const renderProgressBar = (progressPercentage) => {
    const safeProgress = Math.min(progressPercentage || 0, 100);
    return (
      <div className="relative w-full h-2 bg-gray-200 rounded">
        <div
          className="absolute top-0 left-0 h-full rounded progress-bar"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    );
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.put(`/api/Tasks/${updatedTask.id}`, updatedTask, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedTasks = tasks.map(task =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );

      setTasks(updatedTasks);
      setSelectedTask(null);
      setIsEditModalOpen(false);
      console.log('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error.response?.data || error.message);
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

      {/* Список задач */}
      {Object.keys(groupedTasks).length === 0  ? (
        <div className="text-gray-600">No tasks available.</div>
      ) : (
        <>
          {priorities.slice(1).map(priority => (
            groupedTasks[priority].length > 0 && (
              <div key={priority} className="mb-6">
                <div className="flex justify-between items-center">
                  <h2 className={`text-xl font-semibold mb-2 ${getPriorityColor(priority)} text-white p-2 rounded`}>
                    {priority} Priority
                  </h2>
                  <button onClick={() => togglePriorityCollapse(priority)}>
                    {collapsedPriorities[priority] ? '▼' : '▲'}
                  </button>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-500 ${collapsedPriorities[priority] ? 'max-h-0 opacity-0' : 'max-h-screen opacity-100'}`}
                >
                  <ul className="space-y-4">
                    {groupedTasks[priority].map((task) => (
                      <li key={task.id} className="flex bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className={`w-2 ${getStatusColor(task.status)}`} />
                        
                        <div className="flex items-center ml-2">
                          <input
                            type="checkbox"
                            checked={task.status === "Completed"}
                            onChange={() => handleDoneTask(task)}
                            className="h-6 w-6 rounded-full border-gray-300 bg-white checked:bg-green-600 checked:border-transparent focus:outline-none transition duration-300 cursor-pointer"
                          /> 
                        </div>


                        <div className="p-4 flex-1">
                          <div onClick={() => toggleTaskDetails(task)} className="cursor-pointer">
                            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                            <p className="text-gray-500">Status: <span>{task.status}</span></p>
                            {renderProgressBar(task.progressPercentage)}
                          </div>
                        </div>
                        <button
                             onClick={() => handleEditTask(task)}
                             className={`rounded px-4 py-2 transition duration-300 ${
                               task.status === 'Overdue'
                                 ? 'bg-yellow-900 text-red-300 cursor-not-allowed'
                                 : 'bg-yellow-500 text-white hover:bg-yellow-600'
                             }`}
                             disabled={task.status === 'Overdue'}
                           >
                             {task.status === 'Overdue' ? "not able" : "Edit"}
                           </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          ))} 
          {/* Список завершенных задач */}
          {completedTasks.length > 0 && (
            <div className="mb-6"> 
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold mb-2 bg-gray-500 text-white p-2 rounded">
                  Completed Tasks
                </h2>
                <button onClick={() => setShowCompletedTasks(prev => !prev)}>
                  {showCompletedTasks ? '▲' : '▼'}
                </button>
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ${showCompletedTasks ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <ul className="space-y-4">
                  {completedTasks.map((task) => (
                    <li key={task.id} className="flex bg-gray-200 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className={`w-2 ${getStatusColor(task.status)}`} />
                      <div className="flex items-center ml-2">
                          <input
                            type="checkbox"
                            checked={task.status === "Completed"}
                            onChange={() => handleDoneTask(task)}
                            className="h-6 w-6 rounded-full border-gray-300 bg-white checked:bg-green-600 checked:border-transparent focus:outline-none transition duration-300 cursor-pointer"
                          /> 
                        </div>

                      <div className="p-4 flex-1">
                        <div onClick={() => toggleTaskDetails(task)} className="cursor-pointer">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <p className="text-gray-500">Status: <span>{task.status}</span></p>
                          {renderProgressBar(task.progressPercentage)}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleEditTask(task)} 
                        className="bg-yellow-500 text-white rounded px-4 py-2 hover:bg-yellow-600 transition duration-300"
                      >
                        Edit
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {/* Модальное окно для просмотра задачи */}
      <ViewTaskModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        task={selectedTask}
        users={users}
      />

      {/* Модальное окно для редактирования задачи */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </>
  );
};

export default MyTaskList;
