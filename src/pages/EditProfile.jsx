import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import "../style/editProfile.css";
import Sidebar from "../components/SideBar";

const EditProfile = () => {
  const { user, setUser,token, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  const cloudName = 'dem2fr34y'
  const cloud = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  });
const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Link2Play");
  console.log(cloud);
  const res = await fetch(`${cloud}`, {
    method: "POST",
    body: formData,
  });
  console.log("Cloudinary response:", res);

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message|| "Error uploading image");
  }
  return data.secure_url; 
};


const onSubmit = async (formDatas) => {
  try {
    let avatarUrl = user.avatar;

    if (formDatas.avatar && formDatas.avatar[0]) {
      avatarUrl = await uploadImageToCloudinary(formDatas.avatar[0]);
    }

    const response = await fetch(`${url}/profile/editProfile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: formDatas.username,
        email: formDatas.email,
        oldPassword: formDatas.oldPassword,
        newPassword: formDatas.newPassword,
        avatar: avatarUrl,
      }),

    })
   const data = await response.json();

    if (!response.ok) {
      // Gestione errori
      console.error("Errore backend:", data.message);
      return;
    }

   
    setUser(prevUser => ({
      ...prevUser,
      username: formDatas.username || prevUser.username,
  email: formDatas.email || prevUser.email,
  avatar: avatarUrl || prevUser.avatar,
    }));

    
    navigate("/users/me");
    

  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
  }
};

  return (
    <div className="edit-profile">
      <Sidebar />
      <h2>Modifica tus datos</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          {...register("username")}
          defaultValue={user.username}
        />
        {errors.username && <span>This field is required</span>}

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          {...register("email")}
          defaultValue={user.email}
        />
        {errors.email && <span>This field is required</span>}

        <label htmlFor="avatar">Avatar:</label>
        <input type="file" id="avatar" {...register("avatar")} />
        {errors.avatar && <span>This field is required</span>}
        <label htmlFor="text"> Antigua password:</label>
        <input
          type="password"
          id="oldPassword"
          {...register("oldPassword")}

        />
        {errors.oldPassword && <span>This field is required</span>}
        <label htmlFor="password">Nueva password:</label>
        <input
          type="password"
          id="newPassword"
         
          {...register("newPassword")}
        />
        {errors.newPassword && <span>This field is required</span>}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
