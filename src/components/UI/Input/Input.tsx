"use client";

import { InputHTMLAttributes, useEffect, useId, useRef } from "react";
import styles from "./styles.module.scss";
import { Varela_Round } from "next/font/google";

const VarelaRoundFont = Varela_Round({ weight: ["400"], subsets: ["latin-ext"] });

const isStringEmpty = (string: string) => {
  return !string || /^\s*$/.test(string);
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  errorMessage?: null | string;
  valueToLowerCase?: boolean;
  valueWithoutWhiteSpaces?: boolean;
  valueToNumber?: boolean;
}

const Input = ({
  placeholder,
  errorMessage = null,
  valueToLowerCase = false,
  valueWithoutWhiteSpaces = false,
  valueToNumber = false,
  onBlur,
  onInput,
  ...rest
}: InputProps) => {
  const id = useId();
  const inputElementRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (inputElementRef.current) {
      if (valueToLowerCase === true) {
        inputElementRef.current.value = inputElementRef.current.value.toLowerCase();
      }

      if (valueWithoutWhiteSpaces === true) {
        inputElementRef.current.value = inputElementRef.current.value.replace(/\s/g, "");
      }

      if (isStringEmpty(inputElementRef.current.value)) {
        inputElementRef.current.value = "";
      }
    }
  }, [valueToLowerCase, valueWithoutWhiteSpaces]);

  return (
    <div className={`${styles.input}`}>
      <input
        className={`${VarelaRoundFont.className} ${errorMessage ? styles.error : null}`}
        ref={inputElementRef}
        id={id}
        placeholder={placeholder}
        onInput={(event) => {
          if (valueToNumber) {
            const thisElement = event.currentTarget as HTMLInputElement;

            thisElement.value = thisElement.value.replace(/[^0-9]/g, "");
          }

          if (onInput) {
            onInput(event);
          }
        }}
        onBlur={(event) => {
          const thisElement = event.currentTarget as HTMLInputElement;

          if (isStringEmpty(thisElement.value)) {
            thisElement.value = "";
          }

          if (valueToLowerCase === true) {
            thisElement.value = thisElement.value.toLowerCase();
          }

          if (valueWithoutWhiteSpaces === true) {
            thisElement.value = thisElement.value.replace(/\s/g, "");
          }

          if (onBlur) {
            onBlur(event);
          }
        }}
        {...rest}></input>
      <label className={`${VarelaRoundFont.className}`} htmlFor={id}>
        {errorMessage ? errorMessage : placeholder}
      </label>
    </div>
  );
};

export default Input;
