"use client";

import Button from "@/components/UI/Button/Button";
import Input from "@/components/UI/Input/Input";
import styles from "./styles.module.scss";
import animationStyles from "../animationStyles.module.scss";
import { useForm } from "@/customHooks/useForm/useForm";
import { apiUserCreate } from "@/app/api/user/create/route";
import { apiUserCheckEmail } from "@/app/api/user/checkEmail/route";
import { useRef, useState } from "react";
import { clearTimeout } from "timers";
import { ApiResponse } from "@/app/api/api";

const isStringEmpty = (string: string) => {
  return !string || /^\s*$/.test(string);
};

const validateEmail = (string: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(string);
};

const SignUp = () => {
  const [isUserCreated, setIsUserCreated] = useState(false);
  const [Form, status] = useForm(
    [
      [
        {
          placeholder: "Imię",
          name: "firstName",
          type: "text",
          formatting: (value) => {
            return value.charAt(0).toUpperCase() + value.slice(1);
          },
          validateCallback: (value) => {
            if (isStringEmpty(value)) {
              return {
                errorMessage: "Pole nie może być puste",
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
        {
          placeholder: "Nazwisko",
          name: "lastName",
          type: "text",
          formatting: (value) => {
            return value.charAt(0).toUpperCase() + value.slice(1);
          },
          validateCallback: (value) => {
            if (isStringEmpty(value)) {
              return {
                errorMessage: "Pole nie może być puste",
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
          placeholder: "Email",
          name: "email",
          type: "text",
          valueToLowerCase: true,
          validateCallback: async (value) => {
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
          name: "password",
          placeholder: "Hasło",
          type: "password",
          validateCallback: (value) => {
            if (value.length < 6) {
              return {
                errorMessage: "Hasło musi mieć przynajmniej 6 znaków",
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
          name: "repeatPassword",
          placeholder: "Powtórz hasło",
          type: "password",
          validateCallback: (value, { password, repeatPassword }) => {
            if (password!.value !== repeatPassword!.value) {
              return {
                errorMessage: "Hasła różnią się od siebie",
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
    ],
    <Button
      onClick={async () => {
        const { firstName, lastName, email, password } = status;

        const isFormValid = Object.values(status).some((data) => data.isValid === false) === true ? false : true;

        if (isFormValid) {
          const response = await apiUserCheckEmail(email.value as string);

          if (response.status == 200 && email.setError) {
            if (response.response?.isTaken) {
              email.setError("Email jest już zajęty");
            } else {
              const response = await apiUserCreate(firstName.value as string, lastName.value as string, email.value as string, password.value as string);

              if (response.status === 200 && response.response) {
                setIsUserCreated(response.response.isCreated);
              }
            }
          }
        }
      }}>
      Zarejestruj się
    </Button>
  );

  return (
    <div className={`${styles.signUp}`}>
      <Form className={`${styles.form}`} classNameForInlineInputs={`${styles.inputLine}`}></Form>

      <div className={`${styles.separator}`}>
        <p>LUB</p>
      </div>
      <Button show="SignIn" animationIn={{ className: animationStyles.animationIn, duration: 333 }}>
        Zaloguj się
      </Button>
      {isUserCreated && <p className={`${styles.created}`}>Konto zostało utworzone</p>}
    </div>
  );
};

export default SignUp;
