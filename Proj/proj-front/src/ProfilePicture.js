const ProfilePicture = ({ userId, profilePicturePath }) => {
    return (
      <div>
        <img src={`/api/users/profile-picture/${userId}_${profilePicturePath}`} alt="Profile" />
      </div>
    );
  };
  
  export default ProfilePicture;
  