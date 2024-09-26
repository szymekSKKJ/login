"use client";

import { ReactElement, useState } from "react";
import styles from "./styles.module.scss";
import { Varela_Round } from "next/font/google";

const VarelaRoundFont = Varela_Round({ weight: ["400"], subsets: ["latin-ext"] });

const icon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
    </svg>
  );
};

interface CheckBoxInterface {
  callback: (value: boolean) => void;
  size?: number;
  children: React.ReactNode;
}

const CheckBox = ({ callback, children, size = 24 }: CheckBoxInterface) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      className={`${styles.checkBox} ${isChecked ? styles.checked : ""} ${VarelaRoundFont.className}`}
      onClick={async () => {
        const newValue = await new Promise<boolean>((resolve) => {
          setIsChecked((currentValue) => {
            const value = currentValue === false ? true : false;

            resolve(value);

            return value;
          });
        });

        callback(newValue);
      }}>
      <div className={`${styles.icon}`} style={{ "--width": `${size}px` }}>
        <i>{icon()}</i>
      </div>
      <p>{children}</p>
    </div>
  );
};

export default CheckBox;
