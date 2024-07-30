"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";

interface IconProps {
  icon: StaticImport & { src?: string };
  color?: string;
}

const Icon = ({ icon, color }: IconProps) => {
  return (
    <div
      className="w-fit bg-clip-content"
      style={{
        WebkitMaskImage: `url(${icon.src})`,
        maskImage: `url(${icon.src})`,
        backgroundColor: color,
      }}
    >
      <Image src={icon} alt="icon" className="opacity-0" />
    </div>
  );
};

export default Icon;
