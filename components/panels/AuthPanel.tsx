"use client";
import React, { useEffect, useState } from "react";
import Panel from "../Panel";
import { PANELS } from "@/constants/panels";
import LoginForm from "@/forms/LoginForm";
import SignUpForm from "@/forms/SignUpForm";
import { useSession } from "next-auth/react";
import { usePanel } from "@/providers/PanelProvider";

const AuthPanel = () => {
  const { closePanel, isPanelOpen } = usePanel();
  const { data: session, status } = useSession();
  const [currentForm, setCurrentForm] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (status == "authenticated") closePanel(PANELS.AUTH_PANEL);
  }, [status]);

  useEffect(() => {
    if (isPanelOpen(PANELS.AUTH_PANEL)) setCurrentForm("login");
  }, [isPanelOpen(PANELS.AUTH_PANEL)]);

  return (
    <Panel name={PANELS.AUTH_PANEL} closeButton>
      {currentForm == "login" ? (
        <LoginForm
          redirect={false}
          onCreateAccountClick={() => setCurrentForm("signup")}
        ></LoginForm>
      ) : (
        <SignUpForm
          redirect={false}
          onLoginClick={() => setCurrentForm("login")}
        ></SignUpForm>
      )}
    </Panel>
  );
};

export default AuthPanel;
