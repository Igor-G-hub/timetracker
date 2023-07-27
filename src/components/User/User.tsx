import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../index.css";
import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import "./Login.css";
import { COLORS } from "../../themes";
import { RegisterIcon } from "../../shared/assets/svgs";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import { auth } from "../../firebase-config";
import Login from "./Login";
import { validate } from "./helpers/utils";
import Register from "./Register";
import store from "../../store";
import { SET_IS_AUTH } from "../../redux/actionTypes/appActionType";

interface FormData {
  email: string;
  password: string;
}

export const User = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const handleSubmit = () => {
    const errors = validate(formData);
    const isInvalid = Object.values(errors).some((erorr) => !!erorr);
    if (isInvalid) {
      setErrors(errors);
    } else {
      showRegister ? register() : login();
    }
  };

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setShowMessage(true);
    } catch (err) {
      console.log(err);
    }
  };

  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {showRegister ? (
        <Register
          handleSubmit={handleSubmit}
          setShowRegister={setShowRegister}
          errors={errors}
          setFormData={setFormData}
          formData={formData}
          showMessage={showMessage}
          setShowMessage={setShowMessage}
        />
      ) : (
        <Login
          handleSubmit={handleSubmit}
          setShowRegister={setShowRegister}
          errors={errors}
          setFormData={setFormData}
          formData={formData}
        />
      )}
    </>
  );
};

export default User;
