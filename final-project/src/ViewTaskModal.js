import { useEffect, useState } from 'react';
import axios from 'axios';
import API from './api';

const ViewTaskModal = ({ isOpen, onClose, task }) => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  
  useEffect(() => {
    if (isOpen && task) { 
      // Функция для загрузки пользователей по ID
      const fetchAssignedUsers = async () => {
        try {
          const userPromises = task.assignedUserIds.map(async (userId) => {
            // Выполняем запрос для каждого пользователя
            const response = await API.get(`/api/User/${userId}/name`); 
            return response.data;
          });

          // Ждём завершения всех запросов
          const users = await Promise.all(userPromises);
          setAssignedUsers(users);
        } catch (error) {
          console.error('Ошибка при загрузке пользователей:', error);
          setAssignedUsers([]);
        }
      };

      fetchAssignedUsers();
    }
  }, [isOpen, task]);
 

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"> 
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold">Task Details</h3>
        <p>
          <strong>Title:</strong>
          <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.title}
          </div>
        </p>
        <p>
          <strong>Description:</strong>
          <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.description}
          </div>
        </p>
        <p>
          <strong>Status:</strong>
          <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.status}
          </div>
        </p>
        <p>
          <strong>Priority:</strong>
          <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.priority}
          </div>
        </p>
        <p>
  <strong>Deadline:</strong>
  <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
    {new Intl.DateTimeFormat('en-EN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(task.deadline))}
  </div>
</p>

        <p>
          <strong>Notes:</strong>
          <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {task.notes}
          </div>
        </p>
        <p>
          <strong>Assigned Users:</strong>
          <div className="break-words whitespace-pre-wrap max-h-80 overflow-y-auto">
            {assignedUsers.length > 0
              ? assignedUsers.map(user => `${user.firstName} ${user.lastName}`).join(', ')
              : 'No users assigned'}
          </div>
        </p>
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;
