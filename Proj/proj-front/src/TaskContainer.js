import React, { useEffect, useState } from 'react';
import TaskList from './TaskList';
import API
 from './api';
const TaskContainer = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get('api/Tasks');
        const data = await response.json();
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
        // Если API не доступен, пробуем загрузить из localStorage
        const localTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        setTasks(localTasks);
      }
    };

    fetchTasks();
  }, []);

  return <TaskList tasks={tasks} />;
};

export default TaskContainer;
