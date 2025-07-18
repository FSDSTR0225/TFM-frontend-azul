import React, { useState, useContext } from "react";
import "./../style/Authentication.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import AuthContext from "../context/AuthContext";
import sideImg from "/images/register/prueba10.jpg";
import RegisterSuccessModal from "../components/ModalMUI/RegisterSuccessModal.jsx";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

export default function Register() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const [isShowModal, setIsShowModal] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(true);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const modalText = {
    success: "Bienvenido a Link2PLay",
    fail: "Inténtalo de nuevo en unos minutos",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formDatas) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formDatas.username,
          email: formDatas.email,
          password: formDatas.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Error al registrar usuario");
      }
      authContext.login(result.access_token);
      setIsModalSuccess(true);
      setIsShowModal(true);
      setTimeout(() => navigate("/lobby"), 2000);
    } catch (error) {
      setError({ message: error.message });
      setIsModalSuccess(false);
      setIsShowModal(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form glass">
        <div className="RegisterForm__Title">Register Now</div>
        {error && <p className="error">{error.message}</p>}

        <form
          className="RegisterForm"
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            className="RegisterForm__input"
            type="text"
            label="Username"
            variant="outlined"
            defaultValue=""
            autoComplete="new-username"
            {...register("username", {
              required: true,
              minLength: 4,
              maxLength: 20,
            })}
            error={!!errors.username}
            helperText={errors.username ? "Please enter valid username!" : null}
          />
          <TextField
            className="RegisterForm__input"
            type="text"
            label="Email"
            variant="outlined"
            defaultValue=""
            autoComplete="new-email"
            {...register("email", {
              required: true,
              minLength: 10,
              maxLength: 35,
              pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            })}
            error={!!errors.email}
            helperText={errors.email ? "Please enter valid email!" : null}
          />
          <TextField
            className="RegisterForm__input"
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="outlined"
            defaultValue=""
            autoComplete="new-password"
            {...register("password", {
              required: true,
              minLength: 6,
              maxLength: 35,
              pattern: /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/,
            })}
            error={!!errors.password}
            helperText={
              errors.password
                ? "Mínimo 6 caracteres, una mayúscula y un número."
                : null
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            className="RegisterForm__input"
            type={showConfirmPassword ? "text" : "password"}
            label="Confirmar password"
            variant="outlined"
            defaultValue=""
            autoComplete="new-password"
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === watch("password") || "Las contraseñas no coinciden",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            className="RegisterForm__button"
            type="submit"
          >
            Register
          </Button>
          <p className="signup__text">
            Already have an account?{" "}
            <strong
              className="signup__text__strong"
              onClick={() => navigate("/login")}
            >
              Sign in
            </strong>
          </p>
        </form>
      </div>

      <div className="auth-visual">
        <img src={sideImg} alt="gaming background" />
      </div>

      <RegisterSuccessModal
        show={isShowModal}
        onClose={() => setIsShowModal(false)}
        isSuccess={isModalSuccess}
        modalText={modalText}
        errorText={error?.message}
      />
    </div>
  );
}
