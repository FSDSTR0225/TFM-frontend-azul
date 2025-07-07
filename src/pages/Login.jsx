import React, { useState, useContext } from "react";
import "./../style/authentication.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import AuthContext from "../context/AuthContext";
import LoginSuccessModal from "../components/ModalMUI/LoginSuccessModal.jsx";
import sideImg from "/images/register/prueba10.jpg";

export default function Login() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(true);

  const modalText = {
    success: "¿Listo para jugar?",
    fail: "Login fallido. Por favor, inténtalo de nuevo más tarde.",
  };

  const url = `${import.meta.env.VITE_API_URL}/auth/login`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formDatas) => {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: formDatas.login,
        password: formDatas.password,
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          setIsModalSuccess(true);
          authContext.login(result.access_token);
          setTimeout(() => navigate("/lobby"), 1000);
        } else {
          setIsModalSuccess(false);
        }
        setIsShowModal(true);
      })
      .catch((err) => {
        console.log(err);
        setIsModalSuccess(false);
        setIsShowModal(true);
      });
  };

  return (
    <div className="auth-container">
      <div className="auth-form glass">
        <div className="RegisterForm__Title">Login and play!</div>
        <form
          className="RegisterForm"
          autoComplete="on"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            className="RegisterForm__input"
            type="text"
            autoComplete="username"
            {...register("login", {
              required: true,
              maxLength: 35,
              minLength: 4,
            })}
            aria-invalid={errors.login ? "true" : "false"}
            error={errors.login}
            label="Username or Email"
            defaultValue=""
            helperText={
              errors.login ? "Please enter valid username or email!" : null
            }
            variant="standard"
          />
          <TextField
            className="RegisterForm__input"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: true,
              maxLength: 35,
              minLength: 6,
            })}
            aria-invalid={errors.password ? "true" : "false"}
            error={errors.password}
            label="Password"
            defaultValue=""
            helperText={errors.password ? "Please enter valid password!" : null}
            variant="standard"
          />
          <Button
            variant="contained"
            className="RegisterForm__button"
            type="submit"
          >
            Login
          </Button>
          <p className="signup__text">
            Not a member?{" "}
            <strong
              className="signup__text__strong"
              onClick={() => navigate("/register")}
            >
              Sign up
            </strong>
          </p>
        </form>
      </div>
      <div className="auth-visual">
        <img src={sideImg} alt="gamer visual" />
      </div>

      <LoginSuccessModal
        show={isShowModal}
        onClose={() => setIsShowModal(false)}
        isSuccess={isModalSuccess}
        modalText={modalText}
      />
    </div>
  );
}
