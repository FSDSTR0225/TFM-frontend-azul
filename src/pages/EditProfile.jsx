import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import "../style/EditProfile.css";
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
    formState: { errors }, getValues
  } = useForm({mode: "onChange"});
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
  <label htmlFor="username">Nombre de usuario:</label>
  <input
    type="text"
    id="username"
    {...register("username", {
      validate: (value) =>
        value === "" || value.length >= 3 || "Mínimo 3 caracteres",
    })}
    defaultValue={user.username}
  />
  {errors.username && <span>{errors.username.message}</span>}

  <label htmlFor="email">Correo electrónico:</label>
  <input
    type="email"
    id="email"
    {...register("email", {
      validate: (value) =>
        value === "" ||
        /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ||
        "Correo electrónico no válido",
    })}
    defaultValue={user.email}
  />
  {errors.email && <span>{errors.email.message}</span>}

  <label htmlFor="avatar">Avatar:</label>
  <input type="file" id="avatar" {...register("avatar")} />

  <label htmlFor="availability">Disponibilidad horaria:</label>
  <Controller
    name="availability"
    control={control}
    defaultValue={user.availability || ""}
    render={({ field }) => (
      <Select
        {...field}
        options={[
          { value: "notAvailable", label: "No disponible" },
          { value: "morning", label: "Mañana" },
          { value: "afternoon", label: "Tarde" },
          { value: "night", label: "Noche" },
          { value: "allDay", label: "Todo el día" },
        ]}
        styles={customStyles}
        placeholder="Selecciona tu disponibilidad"
      />
    )}
  />

<label htmlFor="oldPassword">Contraseña antigua:</label>
<input
  type="password"
  id="oldPassword"
  {...register("oldPassword", {
    validate: (value) => {
      const newPassword = getValues("newPassword");
      if (newPassword && !value) {
        return "Debes ingresar la contraseña antigua";
      }
      return true;
    },
  })}
/>
{errors.oldPassword && <span>{errors.oldPassword.message}</span>}


<label htmlFor="newPassword">Nueva contraseña:</label>
<input
  type="password"
  id="newPassword"
  {...register("newPassword", {
    validate: (value) =>
      value === "" || value.length >= 6 || "Mínimo 6 caracteres",
  })}
/>
{errors.newPassword && <span>{errors.newPassword.message}</span>}


  <button type="submit">Guardar</button>
</form>


    </div>
  </div>
  );
};

export default EditProfile;
