import { cva, VariantProps } from "class-variance-authority";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "./Icon";

const buttonStyles = cva(
  [
    "h4",
    "rounded-[10px]",
    "py-3",
    "px-6",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      color: {
        transparent: ["bg-transparent", "text-steel-blue"],
        violet: [
          "bg-electric-violet",
          "text-white",
          "enabled:hover:bg-[#C75AF6]",
        ],
        "dark-sky-blue": [
          "bg-dark-sky-blue",
          "text-white",
          "enabled:hover:bg-[#7C91F9]",
        ],
        "navy-blue": [
          "bg-navy-blue",
          "text-white",
          "enabled:hover:bg-[#656EA3]",
        ],
        "navy-blue-border": [
          "border",
          "border-solid",
          "border-navy-blue",
          "text-navy-blue",
          "bg-navy-blue/0",
          "enabled:hover:bg-navy-blue/10",
        ],
        "violet-border": [
          "border",
          "border-solid",
          "border-electric-violet",
          "text-electric-violet",
          "bg-electric-violet/0",
          "enabled:hover:bg-electric-violet/10",
        ],
        crimson: ["bg-crimson", "text-white", "enabled:hover:bg-[#E98888]"],
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
  }
);

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
    "navy-blue-border": "",
    "violet-border": "",
  };

  return (
    <button
      className={twMerge(buttonStyles({ color, variant }), className)}
      {...props}
    >
      {icon && variant == "text-with-icon" ? (
        <Icon icon={icon} color={iconMapColor[color!] || iconColor} />
      ) : null}
      <div
        className={`w-full ${
          variant == "text-with-icon"
            ? "relative after:contents-[' '] after:absolute after:bottom-0 after:h-[1px] after:bg-current after:w-0 enabled:hover:after:w-full after:transition-[width] after:duration-200 after:origin-center after:left-[50%] after:translate-x-[-50%] after:translate-y-[-2px]"
            : ""
        }`}
      >
        {children}
      </div>
    </button>
  );
};

export default Button;
