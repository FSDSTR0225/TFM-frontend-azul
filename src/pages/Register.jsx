import React, { useState, useContext } from "react";
import "./../style/register.css";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import ModalMUI from "../components/ModalMUI/ModalMUI";
import { Button } from "@mui/material";
import AuthContext from "../context/AuthContext";
import sideImg from "/images/register/3.jpg";

export default function Register() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(true);

  const modalText = {
    success: "Now you are ready to play our games!",
    fail: "Register Fail. Please try again later.",
  };

  const url = "http://localhost:3000/auth/register";

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
        username: formDatas.username,
        email: formDatas.email,
        password: formDatas.password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setIsModalSuccess(true);
          setTimeout(() => navigate("/lobby"), 2000);
        } else {
          setIsModalSuccess(false);
        }
        setIsShowModal(true);
        return res.json();
      })
      .then((result) => {
        authContext.login(result.access_token);
      })
      .catch((err) => {
        console.error(err);
        setIsModalSuccess(false);
        setIsShowModal(true);
      });
  };

  return (
    <div className="Register">
      <div className="Register__wrapper">
        <div className="Register__fotoContainer">
          {/* <video
            autoPlay
            loop
            muted
            playsInline
            className="Register__videoLateral"
          >
            <source src="/videos/videogamer1.mp4" type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video> */}
          <img className="Register__foto" src={sideImg} />
        </div>
        <div className="RegisterForm__Container">
          <div className="RegisterForm__Title">Register Now</div>
          <form className="RegisterForm" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              className="RegisterForm__input"
              type="text"
              label="Username"
              variant="standard"
              defaultValue=""
              {...register("username", {
                required: true,
                minLength: 6,
                maxLength: 20,
              })}
              error={!!errors.username}
              helperText={
                errors.username ? "Please enter valid username!" : null
              }
            />
            <TextField
              className="RegisterForm__input"
              type="text"
              label="Email"
              variant="standard"
              defaultValue=""
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
              type="text"
              label="Password"
              variant="standard"
              defaultValue=""
              {...register("password", {
                required: true,
                minLength: 6,
                maxLength: 35,
                pattern: /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/,
              })}
              error={!!errors.password}
              helperText={
                errors.password
                  ? "Password must be at least 6 characters, with capital letters and numbers."
                  : null
              }
            />
            <Button
              variant="contained"
              className="RegisterForm__button"
              type="submit"
            >
              Register
            </Button>
          </form>
        </div>
      </div>

      <ModalMUI
        isShowModal={isShowModal}
        setIsShowModal={setIsShowModal}
        isModalSuccess={isModalSuccess}
        modalText={modalText}
      />
    </div>
  );
}

// import sideImg from "/images/register/3.jpg";
{
  /* <img className="Register__foto" src={sideImg} /> */
}
