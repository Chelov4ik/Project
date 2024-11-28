import React, { useState } from 'react';
import axios from 'axios';

const ProfilePictureUpload = ({ userId, currentProfilePicture }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(currentProfilePicture);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null); // Очистить ошибку при выборе нового файла
  };

  const onUpload = async () => {
    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError(null);

      const response = await axios.post(`/api/users/upload-profile-picture/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert('File uploaded successfully');
      console.log('Response:', response.data);

      // Обновить отображаемое изображение, если загрузка прошла успешно
      setImageUrl(response.data.imageUrl);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError("Failed to upload the file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-picture-upload">
      {imageUrl && <img src={imageUrl} alt="Profile" className="profile-picture" />}
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProfilePictureUpload;
