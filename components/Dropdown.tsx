"use client";
import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { AnimatePresence, motion } from "framer-motion";

import ArrowDownIcon from "/public/shared/icon-caret-down.svg";
import CheckIcon from "/public/shared/icon-check.svg";
import { cva, VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const dropdownToggleStyles = cva(
  [
    "w-full",
    "px-4",
    "lgmd:py-[26px]",
    "sm:py-[16px]",
    "rounded-[10px]",
    "cursor-pointer",
    "select-none",
  ],
  {
    variants: {
      color: {
        "navy-blue": ["bg-navy-blue", "text-white"],
        "cloudy-white": ["bg-cloud-white", "text-navy-blue"],
      },
    },
    defaultVariants: {
      color: "navy-blue",
    },
  }
);

interface Option {
  label: string;
  value: any;
}

type dropdownToggleVariantProps = VariantProps<typeof dropdownToggleStyles>;

type DropdownProps = {
  options: Option[];
  defaultOption?: Option;
  dropdownToggleLabel?: string;
  defaultMessage?: string;
  onValueChange?: (value: Option) => void;
} & dropdownToggleVariantProps;

const Dropdown = ({
  defaultOption,
  options,
  dropdownToggleLabel,
  color,
  defaultMessage,
  onValueChange = () => {},
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption || null);
  const [toggled, setToggled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setToggled(false);
  };

  useEffect(() => {
    if (selectedOption) onValueChange(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setToggled(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="relative z-[5]" ref={ref}>
      <DropdownToggle
        dropdownToggleLabel={dropdownToggleLabel}
        defaultMessage={defaultMessage}
        selectedOption={selectedOption}
        toggled={toggled}
        onClick={() => setToggled(!toggled)}
        color={color}
      ></DropdownToggle>
      <DropdownMenu
        onOptionClick={handleOptionClick}
        options={options}
        toggled={toggled}
        selectedOption={selectedOption}
      ></DropdownMenu>
    </div>
  );
};

type DropdownToggleProps = {
  onClick: () => void;
  selectedOption: Option | null;
  dropdownToggleLabel?: string;
  defaultMessage?: string;
  toggled: boolean;
} & dropdownToggleVariantProps;

const DropdownToggle = ({
  toggled,
  dropdownToggleLabel,
  defaultMessage,
  selectedOption,
  onClick,
  color,
}: DropdownToggleProps) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        dropdownToggleStyles({ color }),
        `${dropdownToggleLabel ? "" : "min-w-[255px]"} `
      )}
    >
      <div
        className={`flex items-center ${
          dropdownToggleLabel ? "gap-3" : "justify-between"
        } `}
      >
        <h4 className="h4 text-inherit">
          {dropdownToggleLabel ? (
            <span className="font-normal">{dropdownToggleLabel} : </span>
          ) : defaultMessage && !selectedOption ? (
            <span className="font-normal">{defaultMessage}</span>
          ) : null}
          {selectedOption?.label}
        </h4>
        <div
          className={`transition-transform duration-200 ${
            toggled ? "rotate-180" : ""
          }`}
        >
          <Icon icon={ArrowDownIcon} color={"currentColor"} />
        </div>
      </div>
    </div>
  );
};

interface DropdownMenuProps {
  toggled: boolean;
  options: Option[];
  selectedOption: Option | null;
  onOptionClick: (option: Option) => void;
}

const DropdownMenu = ({
  toggled,
  options,
  selectedOption,
  onOptionClick,
}: DropdownMenuProps) => {
  return (
    <AnimatePresence>
      {toggled ? (
        <motion.div
          initial={{ opacity: 0, translateY: "-15px" }}
          animate={{ opacity: 100, translateY: "0px" }}
          exit={{ opacity: 0, translateY: "-15px" }}
          transition={{ duration: 0.2 }}
          className="absolute mt-2 w-[255px] overflow-hidden rounded-[10px] bg-white shadow-[0px_10px_40px_-7px_rgba(55,63,104,0.35)]"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between cursor-pointer px-6 py-3 border-b border-solid border-navy-blue/15 last:border-0`}
              onClick={() => onOptionClick(option)}
            >
              <p className="body1 group-hover:text-electric-violet">
                {option.label}
              </p>
              {selectedOption?.label == option.label ? (
                <Icon icon={CheckIcon} color="#AD1FEA" />
              ) : null}
            </div>
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Dropdown;
