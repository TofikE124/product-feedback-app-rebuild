"use client";
import { AnimatePresence, motion } from "framer-motion";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React, { ComponentProps, forwardRef } from "react";

type TextFieldProps = {
  errorMessage?: string;
  textarea?: boolean;
  icon?: StaticImport;
} & (ComponentProps<"input"> & ComponentProps<"textarea">);

const TextField = forwardRef(
  ({ errorMessage, textarea, icon, ...props }: TextFieldProps, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <TextFieldMain
          errorMessage={errorMessage}
          textarea={textarea}
          icon={icon}
          {...props}
          ref={ref}
        ></TextFieldMain>
        <TextFieldErrorMessage
          errorMessage={errorMessage}
        ></TextFieldErrorMessage>
      </div>
    );
  }
);

type TextFieldMainProps = {
  errorMessage?: string;
  textarea?: boolean;
  icon?: StaticImport;
} & (ComponentProps<"input"> & ComponentProps<"textarea">);

const TextFieldMain = forwardRef(
  ({ errorMessage, textarea, icon, ...props }: TextFieldMainProps, ref) => {
    return (
      <motion.div
        className={`bg-cloud-white outline outline-1 transition-[outline-color] duration-200 rounded-[5px] py-3 ${
          icon ? "px-4" : "px-6"
        } ${
          errorMessage
            ? "outline-crimson"
            : " outline-cloud-white hover:outline-dark-sky-blue"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon ? <Image src={icon} alt="" /> : null}
          {textarea ? (
            <textarea
              ref={ref as any}
              {...props}
              className="w-full h-[30px] max-h-[150px] bg-transparent outline-none body2 text-navy-blue"
            ></textarea>
          ) : (
            <input
              ref={ref as any}
              {...props}
              className="bg-transparent outline-none body2 text-navy-blue w-full"
            ></input>
          )}
        </div>
      </motion.div>
    );
  }
);

interface TextFieldErrorMessageProps {
  errorMessage?: string;
}

const TextFieldErrorMessage = ({
  errorMessage,
}: TextFieldErrorMessageProps) => {
  return (
    <AnimatePresence>
      {errorMessage ? (
        <motion.h4
          initial={{ opacity: 0, translateY: "-5px" }}
          animate={{ opacity: 100, translateY: "0px" }}
          exit={{ opacity: 0, translateY: "-5px", height: 0 }}
          transition={{ duration: 0.2 }}
          className="h4 text-crimson font-normal"
        >
          {errorMessage}
        </motion.h4>
      ) : null}
    </AnimatePresence>
  );
};

TextFieldMain.displayName = "TextFieldMain";
TextField.displayName = "TextFeild";
export default TextField;
