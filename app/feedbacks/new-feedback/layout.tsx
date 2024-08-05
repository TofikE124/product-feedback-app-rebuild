import { Metadata } from "next";
import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return children;
};

export const metadata: Metadata = {
  title: "Create New Feedback",
  description: "Create new Feedback Page",
};

export default layout;
