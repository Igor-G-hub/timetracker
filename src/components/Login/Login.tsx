import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../index.css";
import ReactDOM from "react-dom";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import "./Login.css";
import { COLORS } from "../../themes";
import { RegisterIcon } from "../../shared/assets/svgs";

export const Login = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});

  const formik = useFormik({
    initialValues: {   
      name: "",
      password: "",
    },
    validate: (data) => {
      let errors = {
        name: "",
        password: ""
      };

      if (!data.name) {
        errors.name = "Name is required.";
      }     

      if (!data.password) {
        errors.password = "Password is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      setFormData(data);
      setShowMessage(true);

      formik.resetForm();
    }
  });

  const isFormFieldValid = (name: string) =>
    !!(formik.touched[name as keyof typeof formik.touched] && formik.errors[name as keyof typeof formik.touched]);

  const getFormErrorMessage = (name: string) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name as keyof typeof formik.touched]}</small>
      )
    );
  };

  return (
      <div className="flex justify-content-center align-items-center flex-column">
        <div className="card" style={{marginTop: "40px", width: "100%", maxWidth: "400px", padding: "30px", background: COLORS.whiteLilac}}>
          <h5 className="text-center">Login</h5>
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <span className="p-float-label">
                <InputText
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  autoFocus
                  className={classNames({
                    "p-invalid": isFormFieldValid("name")
                  })}
                />
                <label
                  htmlFor="name"
                  className={classNames({
                    "p-error": isFormFieldValid("name")
                  })}
                >
                  Name*
                </label>
              </span>
              {getFormErrorMessage("name")}
            </div>

            <div className="field" style={{marginTop: "30px"}}>
              <span className="p-float-label">
                <Password
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  toggleMask
                  className={classNames({
                    "p-invalid": isFormFieldValid("password")
                  })}
                />
                <label
                  htmlFor="password"
                  className={classNames({
                    "p-error": isFormFieldValid("password")
                  })}
                >
                  Password*
                </label>
              </span>
              {getFormErrorMessage("password")}
            </div>
            <Button type="submit" label="Login" className="mt-2" style={{background: COLORS.orange, outline: "none !important"}}/>
          </form>
        </div>
        <div className="card" style={{marginTop: "40px", width: "100%", maxWidth: "400px", background: COLORS.whiteLilac, cursor: "pointer"}}><RegisterIcon/></div>
      </div>
  );
};

export default Login;
