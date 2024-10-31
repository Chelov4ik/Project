import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from './api'; // Импортируем API
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Импортируем иконки для глаза

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Состояние для отображения пароля
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Переключаем видимость пароля
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-poppins bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/LoginBackground.gif')" }}>
      {/* Затемнение поверх GIF-фона */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Логотип и текст MyCompany слева сверху */}
      <div className="absolute top-0 left-0 p-4 flex items-center z-20">
        <img src="/Logo.png" alt="Company Logo" className="h-20 mr-3" />  
        <span className="text-white text-2xl font-semibold tracking-wide drop-shadow-lg">
          MyCompany
        </span>
      </div>

      {/* Контент формы с прозрачностью */}
      <div className="relative bg-white bg-opacity-90 shadow-2xl rounded-lg p-8 max-w-md w-full z-10">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 drop-shadow-lg">
          Login
        </h2>
        {errorMessage && <div className="mb-4 text-red-500 text-center drop-shadow-sm">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-300 shadow-md hover:shadow-lg transition duration-300"
              disabled={isLoading} // Отключаем поле при загрузке
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // Меняем тип input в зависимости от состояния showPassword
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-300 shadow-md hover:shadow-lg transition duration-300"
              disabled={isLoading} // Отключаем поле при загрузке
            />
            <button
              type="button"
              onClick={togglePasswordVisibility} // Добавляем обработчик для переключения
              className="absolute right-3 top-10 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />} {/* Иконка глаза */}
            </button>
          </div>
          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-md shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
