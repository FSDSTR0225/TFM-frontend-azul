import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import "../style/editProfile.css";
import Sidebar from "../components/SideBar";

const EditProfile = () => {
  const { user, updateUser, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
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
    await updateUser(formDatas);
    navigate("/users/me");
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
        <input
          type="file"
          id="avatar"
          defaultValue={user.avatar}
          {...register("avatar")}
        />
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
