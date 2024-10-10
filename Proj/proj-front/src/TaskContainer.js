import React, { useEffect, useState } from 'react';
import TaskList from './TaskList';

const TaskContainer = () => {
  const [tasks, setTasks] = useState([]); // Инициализируем как пустой массив

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:5283/api/Tasks'); // Замените на ваш URL
        const data = await response.json();
        console.log(data); // Посмотрите, что приходит из API
        if (Array.isArray(data)) {
          setTasks(data); // Убедитесь, что data - это массив
        } else {
          setTasks([]); // Если не массив, устанавливаем пустой массив
        }
      } catch (error) {
        console.error("Ошибка при получении задач:", error);
        setTasks([]); // Устанавливаем пустой массив в случае ошибки
      }
    };

    fetchTasks();
  }, []);

  return <TaskList tasks={tasks} />; // Передаем tasks в TaskList
};

export default TaskContainer;
