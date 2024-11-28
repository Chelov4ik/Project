import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import API from './api';
import TaskList from './TaskList';
import MyTaskList from './MyTaskList';
import UserList from './UserList';
import AddUserForm from './AddUserForm';
import AddNews from './AddNews';
import Sidebar from './Sidebar';
import CreateTask from './CreateTask';
import { FaTasks, FaUserFriends, FaChartLine } from 'react-icons/fa';
import UpdateUser from './UpdateUser';

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null); // Для модального окна
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth) return;
      setLoading(true);
      try {
        if (auth.role === 'admin' || auth.role === 'manager') {
          const userResponse = await API.get('/api/User/all', {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          });
          setUsers(userResponse.data);
        }

        if (auth.role === 'admin' || auth.role === 'manager') {
          const allTasksResponse = await API.get('/api/Tasks', {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          });
          setAllTasks(allTasksResponse.data);
        }

        if (auth.role === 'manager' || auth.role === 'worker') {
          const taskResponse = await API.get(`/api/Tasks/user/${auth.id}`, {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
          });
          setTasks(taskResponse.data);
        }

        const newsResponse = await API.get('/api/News', {
          headers: { Authorization: `Bearer ${auth.accessToken}` },
        });
        setNews(newsResponse.data.reverse());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (auth) fetchData();
  }, [auth]);

  const handleDelete = async (userId) => {
    try {
      await API.delete(`/api/User/${userId}`, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      setUsers((prevUsers) => prevUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleAddUser = async (newUser) => {
    try {
      const response = await API.post('/api/Auth/register', newUser, {
        headers: { Authorization: `Bearer ${auth.accessToken}` },
      });
      setUsers((prevUsers) => [...prevUsers, response.data]);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };

  const handleAddNews = async (newNews) => {
    try{
      const response = await API.post('/api/News',newNews,{
        headers: {Authorization: `Bearer ${auth.accessToken}`}
      }) 
    } catch (error) {
      console.error(error);
    }
  }

  const renderNews = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((article) => (
          <div
            key={article.id}
            className="bg-gray-50 p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer hover:shadow-xl hover:bg-blue-100"
            onClick={() => setSelectedNews(article)}
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">{article.title}</h3>
            <p className="text-gray-700 mb-4">{article.summary}</p>
            <button className="text-blue-600 hover:text-blue-800 transition duration-300">{new Intl.DateTimeFormat('en-EN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(article.publishedDate))}</button>
          </div>
        ))}
      </div>
    );
  };

  const renderSection = () => {
    switch (currentSection) {
      case 'users':
        return <UserList users={users} onDelete={handleDelete} onAddUser={handleAddUser} currentUser={auth} />;
      case 'addUser':
          return <AddUserForm onAddUser={handleAddUser} />;
      case 'addNews':
        return <AddNews onAddNews={handleAddNews} />;
      case 'tasks':
        return <TaskList initialTasks={allTasks} users={users} />;
      case 'updateUser':
        return <UpdateUser userId={auth.id} setCurrentSection={setCurrentSection} />;
      case 'myTasks':
        return <MyTaskList initialTasks={tasks} users={users} />;
      case 'createTask':
        return <CreateTask currentUser={auth} />;
      case 'dashboard':
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-gray-100 to-gray-200 animate-fadeIn">
            {/* Latest News */}
            <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mb-12">
              <h2 className="text-3xl font-semibold text-blue-600 mb-4">Latest News</h2>
              {renderNews()}
            </div>

            {/* Quick Actions */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div
                className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer hover:shadow-xl"
                onClick={() => setCurrentSection('tasks')}
              >
                <FaTasks className="text-blue-500 text-4xl mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Manage Tasks</h2>
                <p className="text-gray-600">View and manage all your tasks efficiently.</p>
              </div>
              <div
                className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer hover:shadow-xl"
                onClick={() => setCurrentSection('users')}
              >
                <FaUserFriends className="text-green-500 text-4xl mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Your Team</h2>
                <p className="text-gray-600">Monitor the progress and performance of your team.</p>
              </div>
              <div
                className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 cursor-pointer hover:shadow-xl"
                onClick={() => setCurrentSection('myTasks')}
              >
                <FaChartLine className="text-purple-500 text-4xl mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Track Progress</h2>
                <p className="text-gray-600">Check overall progress with detailed analytics.</p>
              </div>
            </div> */}
          </div>
        );
    }
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedNews(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar setCurrentSection={setCurrentSection} />
      <div className="flex-grow bg-gray-100 p-8 ml-16">
        <div className="bg-white shadow-lg rounded-lg p-6">{renderSection()}</div>
      </div>

      {/* Модальное окно для новостей */}
      {selectedNews && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 transition-all ease-in-out"
          onClick={closeModal}
        >
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative transform scale-110 transition-transform duration-300 ease-in-out">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-3xl"
              onClick={() => setSelectedNews(null)}
            >
              ×
            </button>
            <h2 className="text-3xl font-semibold text-blue-800 mb-4">{selectedNews.title}</h2>
            <p className="text-lg text-gray-800">{selectedNews.content}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
