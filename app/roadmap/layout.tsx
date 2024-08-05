import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return children;
};

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Product feedback app Roadmap page",
};

export default layout;
