import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import "../style/editProfile.css";
import Sidebar from "../components/SideBar";

const EditProfile = () => {
  const { user, setUser, token, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;
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

  const onSubmit = async (formDatas) => {
    try {
      const formData = new FormData();
      formData.append("username", formDatas.username);
      formData.append("email", formDatas.email);
      formData.append("oldPassword", formDatas.oldPassword);
      formData.append("newPassword", formDatas.newPassword);

      if (formDatas.avatar && formDatas.avatar[0]) {
        formData.append("avatar", formDatas.avatar[0]);
      }

      const response = await fetch(`${url}/profile/editProfile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // NO Content-Type here — let the browser set it with the correct boundary
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      setUser(data);
      navigate("/users/me");
    } catch (err) {
      console.error("Error modificando perfil:", err);
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
          type="text"
          id="oldPassword"
          {...register("oldPassword")}
          defaultValue={user.oPassword}
        />
        {errors.genre && <span>This field is required</span>}
        <label htmlFor="password">Nueva password:</label>
        <input
          type="password"
          id="newPassword"
          defaultValue={user.nPassword}
          {...register("newPassword")}
        />
        {errors.password && <span>This field is required</span>}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
