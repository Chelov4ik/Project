import { useEffect, useState } from 'react';
import photosAPI from './photosAPI';

const UserDetailsModal = ({ isOpen, user, onClose }) => {
  const [formData, setFormData] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  // Синхронизация formData с user при открытии модального окна
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        ...user,
        profilePicturePath: user.profilePicturePath || null,
      });
    }
  }, [isOpen, user]);

  // Загрузка изображения через API
  useEffect(() => {
    if (formData?.profilePicturePath) {
      const fetchImageUrl = async () => {
        try {
          const imagePath = `api/User/profile-picture/${removeUploadPrefix(formData.profilePicturePath)}`;

          const response = await photosAPI.get(imagePath, { responseType: 'arraybuffer' });

          const extension = formData.profilePicturePath.split('.').pop().toLowerCase();
          let mimeType = 'image/jpeg';

          if (extension === 'png') mimeType = 'image/png';
          else if (extension === 'gif') mimeType = 'image/gif';
          else if (extension === 'webp') mimeType = 'image/webp';

          const blob = new Blob([response.data], { type: mimeType });
          const imageUrl = URL.createObjectURL(blob);

          setProfilePictureUrl(imageUrl);
        } catch (err) {
          console.error('Error loading image:', err);
        }
      };

      fetchImageUrl();
    } else {
      setProfilePictureUrl(null); // Если фото нет, сбрасываем URL
    }
  }, [formData?.profilePicturePath]);

  const removeUploadPrefix = (imagePath) => {
    const prefix = 'uploads\\profile-pictures\\';
    return imagePath?.startsWith(prefix) ? imagePath.substring(prefix.length) : imagePath;
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Заголовок */}
        <h2 className="text-lg font-bold mb-4 text-center">User Details</h2>

        {/* Фото профиля */}
        <div className="flex justify-center mb-4">
          {profilePictureUrl ? (
            <img
              src={profilePictureUrl}
              alt={`${formData.username}'s Profile`}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">No Image</span>
            </div>
          )}
        </div>

        {/* Детали пользователя */}
        <div className="space-y-2">
          <p><strong>Username:</strong> {formData.username}</p>
          <p><strong>First Name:</strong> {formData.firstName}</p>
          <p><strong>Last Name:</strong> {formData.lastName}</p>
          <p><strong>Birth Date:</strong> {new Date(formData.birthDate).toLocaleDateString()}</p>
          <p><strong>Hire Date:</strong> {new Date(formData.hireDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {formData.status}</p>
          <p><strong>Department:</strong> {formData.department}</p>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetailsModal;
