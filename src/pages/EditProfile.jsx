import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import "../style/editProfile.css";
import Sidebar from "../components/SideBar";
import Select from "react-select";
const EditProfile = () => {
  const { user, setUser,token, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
  const cloudName = 'dem2fr34y'
  const cloud = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
   const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "#141C3A", // scuro
      borderColor: state.isFocused ? "#00ffff" : "#3a4a7f",
      boxShadow: state.isFocused ? "0 0 5px #00ffff" : "none",
      borderRadius: "12px",
      color: "#fff",
      padding: "2px 4px",
      "&:hover": {
        borderColor: "#00ffff",
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1B2455", // sfondo dropdown
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,255,255,0.15)",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#00ffff22" : "transparent",
      color: "#fff",
      cursor: "pointer",
      padding: "10px 15px",
      fontWeight: state.isSelected ? "bold" : "normal",
      transition: "background 0.2s",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#00ffff",
      fontWeight: "500",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888",
      fontStyle: "italic",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? "#00ffff" : "#ccc",
      "&:hover": {
        color: "#00ffff",
      },
    }),
    input: (base) => ({
      ...base,
      color: "#fff",
    }),
  };
  const {
    register,
    handleSubmit,
    control,
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
        availability: formDatas.availability?.value 
      }),

    })
   const data = await response.json();

    if (!response.ok) {
   
      console.error("Errore backend:", data.message);
      return;
    }

   
    setUser(prevUser => ({
      ...prevUser,
      username: formDatas.username || prevUser.username,
  email: formDatas.email || prevUser.email,
  avatar: avatarUrl || prevUser.avatar,
  availability: formDatas.availability?.value || prevUser.availability
    }));

    
    navigate("/users/me");
    

  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
  }
};

  return (
  <div className="edit-profile-container">
    <Sidebar />
    <div className="edit-profile">
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
<label htmlFor="availability">Disponibilidad horaria:</label>
<Controller
  name="availability"
  control={control}
  defaultValue={user.availability || ""}
  render={({ field }) => (
    <Select
      {...field}
      options={[
        { value: "No disponible", label: "No disponible" },
        { value: "Mañana", label: "Mañana" },
        { value: "Tarde", label: "Tarde" },
        { value: "Noche", label: "Noche" },
        { value: "Todo el día", label: "Todo el día" }
      ]}
      styles={customStyles}
      placeholder="Selecciona tu disponibilidad"
    />
  )}
/>
{errors.availability && <span>This field is required</span>}


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
  </div>
  );
};

export default EditProfile;
