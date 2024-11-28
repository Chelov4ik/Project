// UserCard.js
import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrashAlt, FaUserShield, FaUserTie } from 'react-icons/fa';
import UserDetailsModal from './UserDetailsModal';
import photosAPI from './photosAPI';

// Функция для получения изображения по отделу
const getImageByDepartment = (department) => {
  switch (department) {
    case 'IT': return '/ITDepartment.jpg';
    case 'HR': return '/HRDepartment.jpg';
    case 'Finance': return '/FinanceDepartment.jpg';
    case 'Marketing': return '/MarketingDepartment.jpg';
    case 'Operations': return '/OperationsDepartment.jpg';
    default: return '/AllDepartment.jpg';
  }
};

const UserCard = ({ user, currentUser, onUserClick, onEditClick, onDeleteClick }) => {
  const [showModal, setShowModal] = useState(false);
  const department = user.department;

  const getUserIcon = (status) => {
    switch (status) {
      case 'admin': return <FaUserShield className="text-lg mr-1" />;
      case 'manager': return <FaUserTie className="text-lg mr-1" />;
      default: return null;
    }
  };

  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    if (user.profilePicturePath) {
      const fetchImageUrl = async () => {
        try {
          const imagePath = "api/User/profile-picture/" + removeUploadPrefix(user.profilePicturePath);
   
          const response = await photosAPI.get(imagePath, { responseType: 'arraybuffer' });
   
          const extension = user.profilePicturePath.split('.').pop().toLowerCase();
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
  }, [user.profilePicturePath]);

  function removeUploadPrefix(imagePath) {
    const prefix = 'uploads\\profile-pictures\\';
    if (imagePath && imagePath.startsWith(prefix)) {
      return imagePath.substring(prefix.length);
    }
    return imagePath;  // если путь не начинается с указанного префикса, возвращаем его без изменений
  }

  const getDefaultIcon = () => {
    return <FaUser className="w-full h-full object-cover transform transition-transform duration-200 hover:scale-110" />;
  };

  return (
    <>
      <div
        key={user.id}
        onClick={() => setShowModal(true)}
        className={`relative p-2 rounded-lg transform transition-transform duration-300 hover:scale-105 text-white flex flex-col items-center cursor-pointer ${
          currentUser.role !== "admin" ? "justify-center" : ""
        }`}
        style={{
          height: '150px',
          backgroundImage: `url(${getImageByDepartment(department)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Затемненный фон */}
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" style={{ zIndex: 0 }}></div>

        <div className={`relative ${currentUser.role !== "admin" ? "w-24 h-24" : "w-16 h-16"} overflow-hidden rounded-full`} style={{ zIndex: 1 }}>
          {/* Если есть аватарка, показываем её, если нет — иконку пользователя */}
          {profilePictureUrl ? (
            <img 
              src={profilePictureUrl} 
              alt="Profile" 
              className="w-full h-full object-cover transform transition-transform duration-200 hover:scale-110" 
            />
          ) : (
            getDefaultIcon() // Иконка пользователя по умолчанию
          )}
        </div>

        {/* Если не админ, имя растягивается */}
        <div
          style={{ zIndex: 2 }}
          className={`flex items-center mt-2 ${currentUser.role !== "admin" ? "text-xl font-bold" : ""}`}
        >
          <span className="font-semibold text-lg">{user.username}</span>
          {currentUser.role === "admin" && getUserIcon(user.status)}
        </div>

        {/* Кнопки видны только админу */}
        {currentUser.role === "admin" && (
          <div className="mt-2 flex space-x-1" style={{ zIndex: 2 }}>
            <button
              className="flex items-center text-gray-800 border border-gray-300 px-3 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(user);
              }}
            >
              <FaEdit className="text-lg" />
            </button>
            {user.status !== "admin" && (
              <button
                className="flex items-center text-red-600 border border-red-300 px-3 py-2 rounded hover:bg-red-100 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(user);
                }}
              >
                <FaTrashAlt className="text-lg" />
              </button>
            )}
          </div>
        )}
      </div>

      <UserDetailsModal 
        isOpen={showModal} // Передаем isOpen
        user={user}
        onClose={() => setShowModal(false)} 
      />
    </>
  );
};

export default UserCard;
