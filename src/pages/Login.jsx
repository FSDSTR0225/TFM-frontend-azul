import React, { useState, useContext } from "react";
import "./../style/register.css";
import sideImg from "/images/register/3.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import ModalMUI from "../components/ModalMUI/ModalMUI";
import { Button, TextField } from "@mui/material";
import AuthContext from "../context/AuthContext";
import LoginSuccessModal from "../components/ModalMUI/LoginSuccessModal.jsx";

export default function Login() {
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  const [isShowModal, setIsShowModal] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(true);

  const modalText = {
    success: "Login succes! Now lets play",
    fail: "Login Fail. Please try again Later",
  };
  const url = "http://localhost:3000/auth/login";
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formDatas) => {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: formDatas.login,
        password: formDatas.password,
      }),
    })
      .then(async (res) => {
        const result = await res.json();
        console.log(result);

        if (res.ok) {
          setIsModalSuccess(true);
          authContext.login(result.user, result.access_token);

          setTimeout(() => {
            navigate("/lobby");
          }, 2000);
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
    <div className="Register">
      <div className="Register__wrapper">
        <div className="Register__fotoContainer">
          <img className="Register__foto" src={sideImg} />
        </div>
        <div className="RegisterForm__Container">
          <div className="RegisterForm__Title">Login and play!</div>
          <form className="RegisterForm" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              className="RegisterForm__input"
              type="text"
              {...register("login", {
                required: true,
                maxLength: 35,
                minLength: 4,
                // pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
              })}
              aria-invalid={errors.email ? "true" : "false"}
              error={errors.email}
              // id="standard-error-helper-text"
              label="Username or Email"
              defaultValue=""
              // color=""
              helperText={
                errors.email ? "Please enter valid username or email!" : null
              }
              variant="standard"
            />
            <TextField
              className="RegisterForm__input"
              type="password"
              {...register("password", {
                required: true,
                maxLength: 35,
                minLength: 6,
                // pattern: /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/,
              })}
              aria-invalid={errors.password ? "true" : "false"}
              error={errors.password}
              id="standard-error-helper-text"
              label="Password"
              defaultValue=""
              // color=""
              helperText={
                errors.password ? "Please enter valid password!" : null
              }
              variant="standard"
            />
            {errors.exampleRequired && <span>This field is required</span>}
            <Button
              variant="contained"
              className="RegisterForm__button"
              type="submit"
              value="Register"
            >
              Login
            </Button>
            <p className="signup__text">
              Not a member?{" "}
              <strong
                className="signup__text__strong"
                onClick={() => navigate("/register")}
              >
                Signup now
              </strong>
            </p>
          </form>
        </div>
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
// List of validation rules supported:
// required
// min
// max
// minLength
// maxLength
// pattern
// validate
