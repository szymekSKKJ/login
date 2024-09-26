"use client";

import ComponentsTransition from "react-components-transition/ComponentsTransition";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import styles from "./styles.module.scss";

const SignInOrSignUpForms = () => {
  return (
    <div className={`${styles.signInOrSignUpForms}`}>
      <div className={`${styles.wrapper}`}>
        <ComponentsTransition>
          <SignIn key="SignIn"></SignIn>
          <SignUp key="SignUp"></SignUp>
        </ComponentsTransition>
      </div>
    </div>
  );
};

export default SignInOrSignUpForms;
