import Link from "next/link";
import Icon from "./Icon";
import LeftArrowIcon from "/public/shared/icon-caret-left.svg";
import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
  iconColor?: string;
}

const GoBack = ({ className, iconColor }: Props) => {
  return (
    <Link
      href=".."
      className={twMerge("flex gap-4 items-center cursor-pointer", className)}
    >
      <Icon icon={LeftArrowIcon} color={iconColor ?? "#4661E6"}></Icon>
      Go Back
    </Link>
  );
};

export default GoBack;
