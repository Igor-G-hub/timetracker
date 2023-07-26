import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../index.css";
import React, { ChangeEvent } from "react";
import { FormEvent } from 'react';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import "./Login.css";
import { COLORS } from "../../themes";
import { RegisterIcon } from "../../shared/assets/svgs";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "@firebase/auth";
import { auth } from "../../firebase-config";
import { FormikProps } from "formik";
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../routes";
import { SET_IS_AUTH } from "../../redux/actionTypes/appActionType";
import store from '../../store';

interface FormValues {    
    email: string,
    password: string,
  }

interface Props {
    // formik: FormikProps<FormValues>,
    errors: {
      email: string,
      password: string,
    }
    handleSubmit: Function,
    setShowRegister: Function
    formData: {
      email: string,
      password: string,
    }
    setFormData: Function
    setShowMessage: Function
    showMessage: boolean
    
}

export const Register: React.FC<Props> = ({handleSubmit, setShowRegister, errors, formData, setFormData, showMessage, setShowMessage}) => { 
  const navigate = useNavigate();

  const onSucces = () => {
    setShowMessage(false);
    store.dispatch({
      type: SET_IS_AUTH,
      payload: {
        isAuth: true
      }
    })
  }
  const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => onSucces()} /></div>;
  return (
    <div>
    <Dialog visible={showMessage} onHide={() => onSucces()} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
              <div className="flex align-items-center flex-column pt-6 px-3">
                  <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                  <h5>Registration Successful!</h5>
                  <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                      Your account {formData.email} is registered.
                  </p>
              </div>
          </Dialog>
      <div className="flex justify-content-center align-items-center flex-column">
        <div className="card" style={{marginTop: "40px", width: "100%", maxWidth: "400px", padding: "30px", background: COLORS.whiteLilac}}>
          <h5 className="text-center">Register</h5>
          <div className="p-fluid">
            <div className="field">
              <span className="p-float-label">
                <InputText
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({
                    ...formData,
                    email: e?.target.value
                  })}
                  autoFocus
                  className={classNames({
                    "p-invalid": !!errors["email"]
                  })}
                />
                <label
                  htmlFor="name"
                  className={classNames({
                    "p-error": !!errors["email"]
                  })}
                >
                  Name*
                </label>
              </span>
              {errors["email"] && <small className="p-error">{errors["email"]}</small>}
            </div>

            <div className="field" style={{marginTop: "30px"}}>
              <span className="p-float-label">
                <Password
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({
                    ...formData,
                    password: e?.target.value
                  })}
                  toggleMask
                  className={classNames({
                    "p-invalid": errors["password"]
                  })}
                />
                <label
                  htmlFor="password"
                  className={classNames({
                    "p-error": errors["password"]
                  })}
                >
                  Password*
                </label>
              </span>
              {errors["password"] && <small className="p-error">{errors["password"]}</small>}
            </div> 
            <Button label="Register" className="mt-2" style={{background: COLORS.orange, outline: "none !important"}} onClick={() => handleSubmit()}/>           
          </div>          
        </div>
        <div className="card" style={{marginTop: "40px", width: "100%", maxWidth: "400px", background: COLORS.whiteLilac, cursor: "pointer"}} onClick={() => setShowRegister(false)}>Login</div>
      </div>
      </div>
  );
};

export default Register;
