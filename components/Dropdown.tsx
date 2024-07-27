"use client";
import React, { useEffect, useState } from "react";
import Icon from "./Icon";
import { AnimatePresence, motion } from "framer-motion";

import ArrowDownIcon from "/public/shared/icon-arrow-down.svg";
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
    // "transition-[outline-color]",
    // "duration-200",
    // "outline",
    // "outline-1",
    // "outline-electric-violet/0",
    // "hover:outline-electric-violet",
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

type dropdownToggleVariantProps = VariantProps<typeof dropdownToggleStyles>;

type DropdownProps = {
  options: string[];
  defaultOption?: string;
  dropdownToggleLabel?: string;
  defaultMessage?: string;
} & dropdownToggleVariantProps;

const Dropdown = ({
  defaultOption,
  options,
  dropdownToggleLabel,
  color,
  defaultMessage,
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption || null);
  const [toggled, setToggled] = useState(false);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setToggled(false);
  };

  return (
    <div className="relative">
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
  selectedOption: string | null;
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
          {selectedOption}
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
  options: string[];
  selectedOption: string | null;
  onOptionClick: (option: string) => void;
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
          className="absolute mt-4 w-[255px] overflow-hidden rounded-[10px] bg-white shadow-[0px_10px_40px_-7px_rgba(55,63,104,0.35)]"
        >
          {options.map((option, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between cursor-pointer px-6 py-3 border-b border-solid border-navy-blue/15 last:border-0`}
              onClick={() => onOptionClick(option)}
            >
              <p className="body1 group-hover:text-electric-violet">{option}</p>
              {selectedOption == option ? (
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
