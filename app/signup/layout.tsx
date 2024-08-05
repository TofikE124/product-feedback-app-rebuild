import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return children;
};

export const metadata: Metadata = {
  title: "Signup",
  description: "Product feedback app Signup page",
};

export default layout;
