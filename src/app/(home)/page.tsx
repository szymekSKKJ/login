"use client";

import Button from "@/components/UI/Button/Button";
import styles from "./styles.module.scss";
import ComponentsTransition from "react-components-transition/ComponentsTransition";
import SignInOrSignUpForms from "@/components/SignInOrSignUpForms/SignInOrSignUpForms";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { Varela_Round } from "next/font/google";
import animationStyles from "./animationStyles.module.scss";

const VarelaRoundFont = Varela_Round({ weight: ["400"], subsets: ["latin-ext"] });

const HomePage = () => {
  return (
    <div className={`${styles.homePage}`}>
      <div className={`${styles.logo}`}>
        <Image src={logo} alt="Logo"></Image>
        <p className={`${VarelaRoundFont.className}`}>QUIZUQ</p>
      </div>
      <div className={`${styles.wrapper}`}>
        <ComponentsTransition>
          <div key="Buttons" className={`${styles.buttons}`}>
            <Button show="SignInOrSignUpForms" animationIn={{ className: animationStyles.animationIn, duration: 333 }}>
              Utwórz quiz
            </Button>
            <div className={`${styles.separator}`}>
              <p>LUB</p>
            </div>
            <Button>Dołącz do quizu</Button>
          </div>
          <SignInOrSignUpForms key="SignInOrSignUpForms"></SignInOrSignUpForms>
        </ComponentsTransition>
      </div>
    </div>
  );
};

export default HomePage;
