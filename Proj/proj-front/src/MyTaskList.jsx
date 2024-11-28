import { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditTaskModal from './EditTaskModal';
import ViewTaskModal from './ViewTaskModal';
import API from './api';
import './TaskList.css';

const ItemType = 'TASK';

const MyTaskList = ({ initialTasks, users = [] }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusesOrder, setStatusesOrder] = useState([]);
  const [newStatus, setNewStatus] = useState('');  // Для ввода нового статуса

  // Загружаем статусы из localStorage при монтировании компонента
  useEffect(() => {
    const savedStatuses = JSON.parse(localStorage.getItem('statusesOrder'));
    if (savedStatuses) {
      setStatusesOrder(savedStatuses);
    } else {
      // Если в localStorage нет статусов, используем стандартные
      setStatusesOrder(['Overdue', 'Issued', 'InProgress', 'Completed']);
    }
  }, []);

  // Сохраняем статусы в localStorage при изменении
  useEffect(() => {
    if (statusesOrder.length > 0) {
      localStorage.setItem('statusesOrder', JSON.stringify(statusesOrder));
    }
  }, [statusesOrder]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const token = localStorage.getItem('token');
      await API.put(`/api/Tasks/${updatedTask.id}`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedTasks = tasks.map((task) =>
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

  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    const updatedTask = updatedTasks.find((task) => task.id === taskId);
    handleSaveTask(updatedTask);
  };

  const handleAddNewStatus = () => {
    if (newStatus && !statusesOrder.includes(newStatus)) {
      const updatedStatuses = [...statusesOrder, newStatus];
      setStatusesOrder(updatedStatuses);
      setNewStatus(''); // Очистить поле ввода
    }
  };

  const groupedByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});

  const renderProgressBar = (progressPercentage) => {
    const safeProgress = Math.min(progressPercentage || 0, 100);
    return (
      <div className="relative w-full h-2 bg-gray-200 rounded">
        <div
          className="absolute top-0 left-0 h-full rounded bg-blue-500"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Issued':
        return 'bg-blue-100 border-blue-500';
      case 'InProgress':
        return 'bg-yellow-100 border-yellow-500';
      case 'Completed':
        return 'bg-green-100 border-green-500';
      case 'Overdue':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  const TaskCard = ({ task }) => {
    const [, drag] = useDrag({
      type: ItemType,
      item: { id: task.id, status: task.status },
      end: (item, monitor) => {
        if (monitor.didDrop()) {
          console.log('Dropped:', item);
        }
      },
    });

    const handleComplete = () => {
      if (task.status !== 'Completed') {
        updateTaskStatus(task.id, 'Completed');
      }
    };

    const handleUndo = () => {
      if (task.status === 'Completed') {
        updateTaskStatus(task.id, 'Issued'); // Или другой статус
      }
    };

    return (
      <div
        ref={drag}
        className={`p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border cursor-pointer ${
          task.status === 'Overdue' ? 'border-red-500' : 'bg-white'
        }`}
        onClick={() => handleViewTask(task)}
      >
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <p className="text-gray-500">Priority: {task.priority}</p>
        <p className="text-gray-500">Status: {task.status}</p>
        {renderProgressBar(task.progressPercentage)}
        <div className="flex justify-between mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditTask(task);
            }}
            className="text-blue-500 hover:underline"
          >
            Edit
          </button>
          {/* Условная отрисовка кнопки */}
          {task.status !== 'Completed' ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleComplete();
              }}
              className="text-green-500 hover:underline"
            >
              Complete
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUndo();
              }}
              className="text-yellow-500 hover:underline"
            >
              Undo
            </button>
          )}
        </div>
      </div>
    );
  };

  const StatusColumn = ({ status, children }) => {
    const [, drop] = useDrop({
      accept: ItemType,
      drop: (item) => {
        console.log(`Dropped task ${item.id} into status: ${status}`);
        if (item.status !== status) {
          updateTaskStatus(item.id, status);
        }
      },
    });

    return (
      <div ref={drop} className="flex-shrink-0">
        <h2
          className={`text-xl font-semibold mb-4 px-4 py-2 rounded-lg border ${getStatusColor(status)}`}
        >
          {status}
        </h2>
        <div className="space-y-4">{children}</div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {statusesOrder.map((status) => (
          <StatusColumn key={status} status={status}>
            {(groupedByStatus[status] || []).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </StatusColumn>
        ))}
      </div>
 
      <ViewTaskModal
        task={selectedTask}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
      <EditTaskModal
        task={selectedTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTask}
      />
    </DndProvider>
  );
};

export default MyTaskList;
