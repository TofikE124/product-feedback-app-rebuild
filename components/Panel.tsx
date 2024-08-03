"use client";
import { usePanel } from "@/providers/PanelProvider";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import Icon from "./Icon";
import CloseIcon from "/public/shared/icon-close.svg";

interface PanelProps {
  name: string;
  children?: ReactNode;
  className?: string;
  closeButton?: boolean;
}

const Panel = ({ children, name, closeButton, className }: PanelProps) => {
  const { isPanelOpen, closePanel } = usePanel();

  return (
    <div
      className={`fixed z-30 inset-0 flex items-center justify-center transition-all duration-300 h-screen py-10  ${
        isPanelOpen(name) ? "visible" : "invisible"
      }`}
    >
      <div
        className={twMerge(
          `relative z-30 bg-white dark:bg-dark-grey p-8 w-[480px] rounded-md max-w-[480px] sm:max-w-[90%] transition-transform duration-300 max-h-full sm:overflow-y-scroll ${
            isPanelOpen(name) ? "scale-100" : "scale-0"
          }`,
          className
        )}
      >
        {closeButton ? (
          <CloseButton onClick={() => closePanel(name)}></CloseButton>
        ) : null}

        {children}
      </div>
      <BlackOverlay
        onClick={() => closePanel(name)}
        isPanelOpen={isPanelOpen(name)}
      ></BlackOverlay>
    </div>
  );
};

interface CloseButtonProps {
  onClick?: () => void;
}

const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <div className="absolute top-6 right-6">
      <Button
        color="navy-blue"
        className="w-8 h-8 p-2 rounded-full"
        onClick={onClick}
      >
        <Icon icon={CloseIcon} color="#fff" width={16} height={16}></Icon>
      </Button>
    </div>
  );
};

interface BlackOverlayProps {
  onClick?: () => void;
  isPanelOpen: boolean;
}

const BlackOverlay = ({ onClick, isPanelOpen }: BlackOverlayProps) => {
  return (
    <div
      className={`absolute inset-0 bg-black bg-opacity-50 transition-all duration-200 ${
        isPanelOpen ? "opacity-100 visible " : "opacity-0 invisible"
      }`}
      onClick={onClick}
    ></div>
  );
};

export default Panel;
