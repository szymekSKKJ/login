"use client";

import { HTMLAttributes, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import { Varela_Round } from "next/font/google";

const VarelaRoundFont = Varela_Round({ weight: ["400"], subsets: ["latin-ext"] });

const isStringEmpty = (string: string) => {
  return !string || /^\s*$/.test(string);
};

interface TextareaProps extends HTMLAttributes<HTMLDivElement> {
  placeholder: string;
  valueToLowerCase?: boolean;
  valueWithoutWhiteSpaces?: boolean;
  valueWithoutMultipleSpaces?: boolean;
  errorMessage?: null | string;
}

const Textarea = ({
  placeholder,
  valueToLowerCase,
  valueWithoutWhiteSpaces,
  valueWithoutMultipleSpaces,
  onBlur,
  errorMessage = null,
  ...rest
}: TextareaProps) => {
  const textareaElementRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (textareaElementRef.current) {
      if (valueToLowerCase === true) {
        textareaElementRef.current.innerText = textareaElementRef.current.innerText.toLowerCase();
      }

      if (valueWithoutWhiteSpaces === true) {
        textareaElementRef.current.innerText = textareaElementRef.current.innerText.replace(/\s/g, "");
      }

      if (valueWithoutMultipleSpaces) {
        textareaElementRef.current.innerText = textareaElementRef.current.innerText.replace(/\s+/g, " ");
      }

      if (isStringEmpty(textareaElementRef.current.innerText)) {
        textareaElementRef.current.innerText = "";
      }
    }
  }, [valueToLowerCase, valueWithoutWhiteSpaces]);

  return (
    <div className={`${styles.textareaWrapper}`}>
      <div
        className={`${styles.textarea} ${VarelaRoundFont.className} ${errorMessage ? styles.error : null}`}
        ref={textareaElementRef}
        data-placeholder={placeholder}
        role="textbox"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(event) => {
          const thisElement = event.currentTarget as HTMLDivElement;

          if (isStringEmpty(thisElement.innerText)) {
            thisElement.innerText = "";
          }

          if (valueToLowerCase === true) {
            thisElement.innerText = thisElement.innerText.toLowerCase();
          }

          if (valueWithoutWhiteSpaces) {
            thisElement.innerText = thisElement.innerText.replace(/\s/g, "");
          }

          if (valueWithoutMultipleSpaces) {
            thisElement.innerText = thisElement.innerText.replace(/\s+/g, " ");
          }

          if (onBlur) {
            onBlur(event);
          }
        }}
        {...rest}></div>
      <label className={`${VarelaRoundFont.className}`}>{errorMessage ? errorMessage : placeholder}</label>
    </div>
  );
};

export default Textarea;
