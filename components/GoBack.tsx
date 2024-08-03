"use client";
import Link from "next/link";
import Icon from "./Icon";
import LeftArrowIcon from "/public/shared/icon-caret-left.svg";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  className?: string;
  iconColor?: string;
  navigateType?: "history" | "path";
}

const GoBack = ({ className, navigateType = "history", iconColor }: Props) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (navigateType === "path") return;

    if (window.history.length == 2) {
      window.location.href = "/feedbacks";
    } else {
      router.back();
    }
  };

  return (
    <Link
      className={twMerge("flex gap-4 items-center cursor-pointer", className)}
      href={navigateType == "path" ? ".." : ""}
      onClick={handleBackClick}
    >
      <Icon icon={LeftArrowIcon} color={iconColor ?? "#4661E6"}></Icon>
      Go Back
    </Link>
  );
};

export default GoBack;
