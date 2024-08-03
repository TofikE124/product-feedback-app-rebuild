"use client";
import React, { useState } from "react";
import Panel from "../Panel";
import { PANELS } from "@/constants/panels";
import LoginForm from "@/forms/LoginForm";
import SignUpForm from "@/forms/SignUpForm";

const AuthPanel = () => {
  const [currentForm, setCurrentForm] = useState<"login" | "signup">("login");

  return (
    <Panel name={PANELS.AUTH_PANEL} closeButton>
      {currentForm == "login" ? (
        <LoginForm
          onCreateAccountClick={() => setCurrentForm("signup")}
        ></LoginForm>
      ) : (
        <SignUpForm onLoginClick={() => setCurrentForm("login")}></SignUpForm>
      )}
    </Panel>
  );
};

export default AuthPanel;
