"use client";
import React from "react";
import { Oval, OvalProps } from "react-loader-spinner";

const OvalLoadingSpinner = ({
  width = 20,
  height = 20,
  ...props
}: OvalProps) => {
  return (
    <Oval
      {...props}
      width={width}
      height={height}
      color="#fff"
      secondaryColor="#633cff"
      ariaLabel="oval-loading"
    ></Oval>
  );
};

export default OvalLoadingSpinner;
