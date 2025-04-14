import React, { useState } from "react";
import "./../styles/register.css";
import sideImg from "/images/register/3.jpg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import ModalMUI from "../components/ModalMUI/ModalMUI";
import { Button } from "@mui/material";

export default function Register() {
  const navigate = useNavigate();

  const [isShowModal, setIsShowModal] = useState(false);
  const [isModalSuccess, setIsModalSuccess] = useState(true);

  const modalText = {
    success: "Now your are ready to play our games!",
    fail: "Register Fail. Please try again Later",
  };
  const url = "http://localhost:4000/users";
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
        userName: formDatas.fullName,
        password: formDatas.password,
        email: formDatas.email,
      }),
    })
      .then((resposnse) => {
        console.log(resposnse);
        if (resposnse.status === 201) {
          setIsModalSuccess(true);
          setTimeout(() => {
            navigate("/");
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
          <div className="RegisterForm__Title">Register Now</div>
          <form className="RegisterForm" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              type="text"
              className="RegisterForm__input"
              {...register("fullName", {
                required: true,
                maxLength: 20,
                minLength: 6,
              })}
              aria-invalid={errors.fullName ? "true" : "false"}
              error={errors.fullName}
              // id="standard-error-helper-text"
              label="Fullname"
              defaultValue=""
              helperText={
                errors.fullName ? "Please enter valid fullname!" : null
              }
              // color=""
              variant="standard"
            />
            <TextField
              className="RegisterForm__input"
              type="text"
              {...register("email", {
                required: true,
                maxLength: 35,
                minLength: 10,
                pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
              })}
              aria-invalid={errors.email ? "true" : "false"}
              error={errors.email}
              // id="standard-error-helper-text"
              label="Email"
              defaultValue=""
              // color=""
              helperText={errors.email ? "Please enter valid email!" : null}
              variant="standard"
            />
            <TextField
              className="RegisterForm__input"
              type="text"
              {...register("password", {
                required: true,
                maxLength: 35,
                minLength: 6,
                pattern: /^(?=.*[0-9])(?=.*[A-Z]).{6,}$/,
              })}
              aria-invalid={errors.password ? "true" : "false"}
              error={errors.password}
              id="standard-error-helper-text"
              label="Password"
              defaultValue=""
              // color=""
              helperText={
                errors.password
                  ? `Please enter correct password! (Password must be 6 and include capitals and numbers) `
                  : null
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

// List of validation rules supported:
// required
// min
// max
// minLength
// maxLength
// pattern
// validate
