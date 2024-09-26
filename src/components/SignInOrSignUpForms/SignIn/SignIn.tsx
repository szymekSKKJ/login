"use client";

import styles from "./styles.module.scss";
import Button from "@/components/UI/Button/Button";
import animationStyles from "../animationStyles.module.scss";
import { useForm } from "@/customHooks/useForm/useForm";
import { apiUserAuth } from "@/app/api/user/auth/route";
import { useState } from "react";

const validateEmail = (string: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(string);
};

const isStringEmpty = (string: string) => {
  return !string || /^\s*$/.test(string);
};

const SignIn = () => {
  const [loggedInUser, setLoggedInUser] = useState<null | { firstName: string; lastName: string }>(null);
  const [error, setError] = useState<null | string>(null);
  const [Form, formStatus] = useForm(
    [
      [
        {
          type: "text",
          placeholder: "Email",
          name: "email",
          validateCallback: (value) => {
            if (validateEmail(value) === false) {
              return {
                errorMessage: "Podaj poprawny adres email",
                isValid: false,
              };
            } else {
              return {
                errorMessage: null,
                isValid: true,
              };
            }
          },
          valueWithoutWhiteSpaces: true,
        },
      ],
      [
        {
          placeholder: "Hasło",
          type: "password",
          name: "password",
          validateCallback: (value) => {
            if (isStringEmpty(value)) {
              return {
                isValid: false,
                errorMessage: "Pole nie może być puste",
              };
            } else {
              return {
                isValid: true,
                errorMessage: null,
              };
            }
          },
          valueWithoutWhiteSpaces: true,
        },
      ],
    ],
    <Button
      onClick={async () => {
        const { email, password } = formStatus;

        const response = await apiUserAuth(email.value as string, password.value as string);

        if (response.status === 200 && response.response) {
          if (response.response.user) {
            setLoggedInUser({
              firstName: response.response.user.firstName,
              lastName: response.response.user.lastName,
            });
            setError(null);
          }
          if (response.response.isLoggedIn === false && response.message) {
            setError(response.message);
            setLoggedInUser(null);
          }
        }
      }}>
      Zaloguj się
    </Button>
  );

  return (
    <div className={`${styles.signIn}`}>
      <Form className={`${styles.form}`}></Form>
      <div className={`${styles.separator}`}>
        <p>LUB</p>
      </div>
      <Button show="SignUp" animationIn={{ className: animationStyles.animationIn, duration: 333 }}>
        Zarejestruj się
      </Button>
      {loggedInUser ? (
        <p className={`${styles.loggedIn}`}>
          Witaj {loggedInUser.firstName} {loggedInUser.lastName}!
        </p>
      ) : (
        error && <p className={`${styles.loggedIn}`}>{error}</p>
      )}
    </div>
  );
};

export default SignIn;
