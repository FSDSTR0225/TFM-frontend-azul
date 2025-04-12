import React, { useState } from "react";
import "./../styles/register.css";
import myfoto from "./../../public/images/register/3.jpg";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import ModalMUI from "../components/ModalMUI/ModalMUI";

export default function Register() {
  const [isShowregisterModal, setIsShowregisterModal] = useState(false);
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
          setIsShowregisterModal(true);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="Register">
      <div className="Register__wrapper">
        <div className="Register__fotoContainer">
          <img className="Register__foto" src={myfoto} />
        </div>
        <div className="RegisterForm__Container">
          <div className="RegisterForm__Title">Register Here</div>
          <form className="RegisterForm" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              className="RegisterForm__input"
              {...register("fullName", {
                required: true,
                maxLength: 20,
                minLength: 6,
              })}
              // error
              // id="standard-error-helper-text"
              label="Fullname"
              defaultValue=""
              // helperText="Incorrect entry."
              // color=""
              variant="standard"
            />
            <TextField
              className="RegisterForm__input"
              {...register("email", {
                required: true,
                maxLength: 20,
                minLength: 6,
                // pattern: /^[A-Za-z]+$/i,
              })}
              // error
              // id="standard-error-helper-text"
              label="Email"
              defaultValue=""
              // color=""
              // helperText="Incorrect entry."
              variant="standard"
            />
            <TextField
              className="RegisterForm__input"
              {...register("password", { required: true })}
              // error
              // id="standard-error-helper-text"
              label="Password"
              defaultValue=""
              // color=""
              // helperText="Incorrect entry."
              variant="standard"
            />

            {errors.exampleRequired && <span>This field is required</span>}
            {/* <select {...register("platform")}>
        <option value="female">female</option>
        <option value="male">male</option>
        <option value="other">other</option>
      </select> */}
            <input
              className="RegisterForm__button"
              type="submit"
              value="Register"
            />
          </form>
        </div>
      </div>
      <ModalMUI
        isShowregisterModal={isShowregisterModal}
        setIsShowregisterModal={setIsShowregisterModal}
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
