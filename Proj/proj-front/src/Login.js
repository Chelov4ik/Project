import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from './api'; // Импортируем API

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);  
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Сбрасываем сообщение об ошибке при отправке формы
    setIsLoading(true); // Устанавливаем состояние загрузки в true

    try {
      const response = await API.post('/api/Auth/login', { username, password });
      login(response.data); // Используем login для обновления состояния и сохранения в localStorage
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
      setErrorMessage('Invalid username or password.'); // Устанавливаем сообщение об ошибке
    } finally {
      setIsLoading(false); // Сбрасываем состояние загрузки
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        {errorMessage && <div className="mb-4 text-red-500 text-center">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
              disabled={isLoading} // Отключаем поле при загрузке
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-300"
              disabled={isLoading} // Отключаем поле при загрузке
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading} // Отключаем кнопку при загрузке
          >
            {isLoading ? 'Loading...' : 'Login'} {/* Меняем текст на "Loading..." во время загрузки */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
