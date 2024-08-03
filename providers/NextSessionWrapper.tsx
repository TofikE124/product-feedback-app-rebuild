"use client";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

const NextSessionWrapper = ({ children }: PropsWithChildren) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextSessionWrapper;
