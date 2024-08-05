import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return children;
};

export const metadata: Metadata = {
  title: "Login",
  description: "Product feedback app Login page",
};

export default layout;
