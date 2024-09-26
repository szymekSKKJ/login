"use client";

import { TransitionButton } from "react-components-transition";
import styles from "./styles.module.scss";
import { DetailedHTMLProps, ButtonHTMLAttributes, useEffect, useRef } from "react";
import { Varela_Round } from "next/font/google";

const VarelaRoundFont = Varela_Round({ weight: ["400"], subsets: ["latin-ext"] });

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  show?: string;
  animationIn?: {
    duration: number;
    className: string;
  };
  animationOut?: {
    duration: number;
    className: string;
  };
}

const Button = ({ children, onClick, show, animationIn, animationOut, ...rest }: ButtonProps) => {
  return (
    <>
      {show ? (
        <TransitionButton
          className={`${styles.button} ${VarelaRoundFont.className}`}
          show={show}
          animationIn={animationIn}
          animationOut={animationOut}
          onClick={async (event) => {
            const thisElement = event.currentTarget as HTMLButtonElement;
            const { x, y, height } = thisElement.getBoundingClientRect();

            const clickEffectElement = thisElement.querySelector(`.${styles.clickEffect}`) as HTMLDivElement;

            await new Promise<boolean>((resolve) => {
              clickEffectElement.style.left = `${event.clientX - x - height / 2}px`;
              clickEffectElement.style.top = `${event.clientY - y - height / 2}px`;
              clickEffectElement.style.transition = "unset";
              clickEffectElement.style.transform = `scale(0)`;
              clickEffectElement.style.opacity = `1`;

              setTimeout(() => {
                resolve(true);
              }, 10);
            });

            clickEffectElement.style.transition = "400ms opacity, 400ms transform";
            clickEffectElement.style.transform = `scale(4)`;
            clickEffectElement.style.opacity = `0`;

            if (onClick) {
              onClick(event);
            }
          }}
          {...rest}>
          {children}
          <div className={`${styles.clickEffect}`}></div>
        </TransitionButton>
      ) : (
        <button
          className={`${styles.button} ${VarelaRoundFont.className}`}
          onClick={async (event) => {
            const thisElement = event.currentTarget as HTMLButtonElement;
            const { x, y, height } = thisElement.getBoundingClientRect();

            const clickEffectElement = thisElement.querySelector(`.${styles.clickEffect}`) as HTMLDivElement;

            await new Promise<boolean>((resolve) => {
              clickEffectElement.style.left = `${event.clientX - x - height / 2}px`;
              clickEffectElement.style.top = `${event.clientY - y - height / 2}px`;
              clickEffectElement.style.transition = "unset";
              clickEffectElement.style.transform = `scale(0)`;
              clickEffectElement.style.opacity = `1`;

              setTimeout(() => {
                resolve(true);
              }, 10);
            });

            clickEffectElement.style.transition = "400ms opacity, 400ms transform";
            clickEffectElement.style.transform = `scale(4)`;
            clickEffectElement.style.opacity = `0`;

            if (onClick) {
              onClick(event);
            }
          }}
          {...rest}>
          {children}
          <div className={`${styles.clickEffect}`}></div>
        </button>
      )}
    </>
  );
};

export default Button;
