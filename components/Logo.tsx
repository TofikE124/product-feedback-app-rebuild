import React from "react";
import LogoIcon from "/public/logo.svg";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-4 cursor-pointer">
      <Image
        src={LogoIcon}
        alt="Feedback Icon"
        width={40}
        height={40}
        className="size-10"
      />
      <h1 className="h1 text-navy-blue">Feedback</h1>
    </div>
  );
};

export default Logo;
