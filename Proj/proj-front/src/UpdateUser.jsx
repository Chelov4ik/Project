import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import photosAPI from './photosAPI';
import { FiImage } from 'react-icons/fi';

const UpdateUser = ({ userId, setCurrentSection }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    hireDate: '',
    status: '',
    department: '',
    taskIds: [],
    currentPassword: '',
    newPassword: '',
    profilePicturePath: null, // New field for avatar
  });

  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  
  useEffect(() => {
    if (formData.profilePicturePath) {
      const fetchImageUrl = async () => {
        try {
          const imagePath = "api/User/profile-picture/" + removeUploadPrefix(formData.profilePicturePath);
  
          const response = await photosAPI.get(imagePath, { responseType: 'arraybuffer' });
  
          // Определяем MIME-тип изображения из расширения файла
          const extension = formData.profilePicturePath.split('.').pop().toLowerCase();
          let mimeType = 'image/jpeg'; // по умолчанию
  
          if (extension === 'png') {
            mimeType = 'image/png';
          } else if (extension === 'gif') {
            mimeType = 'image/gif';
          } else if (extension === 'webp') {
            mimeType = 'image/webp';
          }
  
          const blob = new Blob([response.data], { type: mimeType });
          const imageUrl = URL.createObjectURL(blob);
          
          setProfilePictureUrl(imageUrl);  
        } catch (err) {
          console.error('Error loading image:', err);
        }
      };
  
      fetchImageUrl();  // Вызов асинхронной функции внутри useEffect
    }
  }, [formData.profilePicturePath]);
  
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get(`/api/User/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        setError(err.response?.data || 'Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        birthDate: user.birthDate || '',
        hireDate: user.hireDate || '',
        status: user.status || '',
        department: user.department || '',
        taskIds: user.taskIds || [],
        currentPassword: '',
        newPassword: '',
        profilePicturePath: user.profilePicturePath || null, // Set avatar if available
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTaskChange = (taskId) => {
    const updatedTaskIds = formData.taskIds.includes(taskId)
      ? formData.taskIds.filter((id) => id !== taskId)
      : [...formData.taskIds, taskId];
    setFormData((prevData) => ({
      ...prevData,
      taskIds: updatedTaskIds,
    }));
  };

  

  const uploadProfilePicture = async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ProfilePicturePath", file.name); // Добавление пути к изображению, если необходимо
  
      const token = localStorage.getItem('token'); // Получение токена для авторизации
  
      const response = await API.post(`/api/User/upload-profile-picture/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Добавление Bearer токена для авторизации
        },
      });
  
      // Если файл был успешно загружен
      if (response.data.FilePath) {
        console.log("File uploaded successfully", response.data.FilePath);
        return response.data.FilePath; // Возвращаем путь файла
      }
    } catch (error) {
      console.error('Error uploading file:', error.response?.data || error.message);
      throw new Error(error.response?.data?.Error || 'Error uploading profile picture');
    }
  };
  

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Загружаем файл
        const filePath = await uploadProfilePicture(userId, file);
  
        // Создаём URL для отображения изображения
        const imageUrl = URL.createObjectURL(file); // Создаём URL для нового изображения
  
        // Обновляем форму и сразу отображаем изображение
        setFormData((prevData) => ({
          ...prevData,
          profilePicturePath: filePath, // Сохраняем путь файла в состоянии
        }));
        setProfilePictureUrl(imageUrl);  // Устанавливаем новый URL изображения
  
      } catch (error) {
        // Обработка ошибок, если загрузка не удалась
        setError(error.message);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.firstName || !formData.lastName) {
      setError('All required fields must be filled.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Prepare the data to be sent inside updateUserDto
      const updateUserDto = {
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: new Date(formData.birthDate).toISOString(),
        hireDate: new Date(formData.hireDate).toISOString(),
        department: formData.department,
        status: formData.status,
        taskIds: formData.taskIds.map(id => parseInt(id, 10)), // Ensure taskIds are integers
        currentPassword: '',
        newPassword: '',
        profilePicturePath: formData.profilePicturePath || "", // Include the avatar if provided
      };

      

      // Add password fields only if they are provided
      if (formData.currentPassword && formData.newPassword) {
        updateUserDto.currentPassword = formData.currentPassword;
        updateUserDto.newPassword = formData.newPassword;
      }

      console.log(updateUserDto);
      // Send the data as FormData
      await API.put(`/api/User/${userId}`, updateUserDto, {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });

      console.log('User updated successfully');
      setCurrentSection('users');
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      setError(error.response?.data || 'Error updating user');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  function removeUploadPrefix(imagePath) {
    const prefix = 'uploads\\profile-pictures\\';
    if (imagePath && imagePath.startsWith(prefix)) {
      return imagePath.substring(prefix.length);
    }
    return imagePath;  // если путь не начинается с указанного префикса, возвращаем его без изменений
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update your data</h2>
      {error && (
        <div className="text-red-500 mb-4">
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
      )}

      {/* Display current profile picture */}
      {profilePictureUrl && (
        <div className="flex justify-center mb-6 relative">
          <img
            src={profilePictureUrl}
            alt="Profile"
            className="w-40 h-40 object-cover rounded-full border-4 border-blue-500"
          />
          {/* Button for avatar change */}
          <label htmlFor="profilePicturePath" className="absolute bottom-0 right-0 mb-2 mr-2">
            <FiImage className="w-8 h-8 text-blue-500 cursor-pointer hover:text-blue-600 transition duration-300" />
          </label>
          <input
            type="file"
            id="profilePicturePath"
            name="profilePicturePath"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div>
          <label className="block text-gray-700">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div>
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            Update User
          </button>
        </div>
      </form> 
    </div>
  );
};

export default UpdateUser;
