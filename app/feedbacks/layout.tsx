import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return children;
};

export const metadata: Metadata = {
  title: "Feedbacks",
  description: "Feedbacks Page",
};

export default layout;
