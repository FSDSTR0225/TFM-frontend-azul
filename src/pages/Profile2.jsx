import React from "react";
import ProfileCard from "../components/ProfileCard";
import Sidebar from "../components/SideBar";


  
const ProfilePage = () => {
 
  return (
    <div className="profile-page">
      
        <Sidebar/>
      <ProfileCard />
    </div>
  );
};

export default ProfilePage;
