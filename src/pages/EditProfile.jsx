import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";

const EditProfile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
useEffect(() => {
    if (!user) {
        navigate("/login");
    }
    try{
        console.log(user);
    }
    catch(err){
        console.log(err);
    }
})
    const onSubmit = async (formDatas) => {
        await updateUser(formDatas);
        navigate("/users/me");
    };

    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    {...register("username", { required: true })}
                    defaultValue={user.username}
                />
                {errors.username && <span>This field is required</span>}

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    {...register("email", { required: true })}
                    defaultValue={user.email}
                />
                {errors.email && <span>This field is required</span>}

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    {...register("password", { required: true })}
                />
                {errors.password && <span>This field is required</span>}

                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditProfile; 