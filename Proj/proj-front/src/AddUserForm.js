import { useState } from 'react';

const AddUserForm = ({ onAddUser }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [status, setStatus] = useState('worker'); // По умолчанию worker
  const [password, setPassword] = useState(''); // Добавлено состояние для пароля

  const handleSubmit = (e) => {
    e.preventDefault();
    // Вызываем функцию для добавления пользователя
    onAddUser({ username, firstName, lastName, birthDate, hireDate, status, password }); // Передаем пароль
    setUsername('');
    setFirstName('');
    setLastName('');
    setBirthDate('');
    setHireDate('');
    setStatus('worker');
    setPassword(''); // Сбрасываем поле пароля
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password" // Тип поля для пароля
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="birthDate">
          Birth Date
        </label>
        <input
          id="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hireDate">
          Hire Date
        </label>
        <input
          id="hireDate"
          type="date"
          value={hireDate}
          onChange={(e) => setHireDate(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="worker">Worker</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add User
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
