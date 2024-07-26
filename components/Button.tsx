import { cva, VariantProps } from "class-variance-authority";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

const buttonStyles = cva(["h4", "rounded-[10px]", "py-3", "px-[52px]"], {
  variants: {
    color: {
      transparent: ["bg-transparent", "text-steel-blue"],
      violet: ["bg-electric-violet", "text-white", "hover:bg-[#C75AF6]"],
      "dark-sky-blue": ["bg-dark-sky-blue", "text-white", "hover:bg-[#7C91F9]"],
      "navy-blue": ["bg-navy-blue", "text-white", "hover:bg-[#656EA3]"],
      crimson: ["bg-crimson", "text-white", "hover:bg-[#E98888]"],
    },
    variant: {
      text: [],
      "text-with-icon": ["flex", "items-center", "gap-4"],
    },
  },
  defaultVariants: {
    color: "violet",
    variant: "text",
  },
});

type ButtonProps = VariantProps<typeof buttonStyles> &
  ComponentProps<"button"> & { icon?: StaticImport; iconColor?: string };

const Button = ({
  className,
  icon,
  iconColor = "#fff",
  children,
  color,
  variant,
  ...props
}: ButtonProps) => {
  const iconMapColor = {
    transparent: "#4661E6",
    "navy-blue": "#CDD2EE",
    violet: "",
    "dark-sky-blue": "",
    crimson: "",
  };

  return (
    <button
      className={twMerge(buttonStyles({ color, variant }), className)}
      {...props}
    >
      {icon && variant == "text-with-icon" ? (
        <Icon icon={icon} color={iconMapColor[color!] || iconColor} />
      ) : null}
      <p
        className={`${
          variant == "text-with-icon"
            ? "relative after:contents-[' '] after:absolute after:bottom-0 after:h-[1px] after:bg-current after:w-0 hover:after:w-full after:transition-[width] after:duration-200 after:origin-center after:left-[50%] after:translate-x-[-50%] after:translate-y-[-2px]"
            : ""
        }`}
      >
        {children}
      </p>
    </button>
  );
};

export default Button;
