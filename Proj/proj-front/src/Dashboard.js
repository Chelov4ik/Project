import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import API from './api';
import TaskList from './TaskList';
import UserList from './UserList';
import AddUserForm from './AddUserForm'; // Импортируем форму
import Sidebar from './Sidebar'; // Импортируем Sidebar

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentSection, setCurrentSection] = useState(''); // Управляем активной секцией

  useEffect(() => {
    const fetchData = async () => {
      if (!auth) return; // Проверяем, что auth существует
  
      try {
        if (auth.role === 'admin' || auth.role === 'manager') {
          const userResponse = await API.get('/api/User', {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
          setUsers(userResponse.data);
        }
  
        if (auth.role === 'admin') {
          const allTasksResponse = await API.get('/api/Tasks', {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
          setAllTasks(allTasksResponse.data);
        }
  
        if (auth.role === 'manager' || auth.role === 'worker') {
          const taskResponse = await API.get(`/api/Tasks/user/${auth.id}`, {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          });
          setTasks(taskResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
        // Возможно, добавьте сообщение для пользователя
      }
    };
  
    fetchData();
  }, [auth]);
  

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/api/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      console.log('Adding new user:', newUser);

      const response = await API.post('/api/User', newUser, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      setUsers((prevUsers) => [...prevUsers, response.data]);
      console.log('User added successfully:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        console.error('No response from server:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'users':
        return <UserList users={users} onDelete={handleDelete} onAdd={handleAddUser} currentUser={auth} />;
      case 'addUser':
        return <AddUserForm onAddUser={handleAddUser} />;
      case 'tasks':
        return <TaskList tasks={allTasks} users={users} />;
      case 'myTasks':
        return <TaskList tasks={tasks} users={users} />;
      default:
        return <p>Welcome to the Dashboard</p>;
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar setCurrentSection={setCurrentSection} />
      <div className="flex-grow bg-gray-100 p-8 ml-16"> {/* Добавляем отступ слева */}
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-xl text-gray-600 mb-8">
          Logged in as: <span className="font-semibold">{auth?.role}</span>
        </p>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {renderSection()} {/* Отображаем активную секцию */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
