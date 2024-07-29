"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { ComponentProps, forwardRef } from "react";

type TextFieldProps = {
  errorMessage?: string;
  textarea?: boolean;
};

const TextField = forwardRef(
  ({ errorMessage, textarea, ...props }: TextFieldProps, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <TextFieldMain
          errorMessage={errorMessage}
          textarea={textarea}
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
} & (ComponentProps<"input"> & ComponentProps<"textarea">);

const TextFieldMain = forwardRef(
  ({ errorMessage, textarea, ...props }: TextFieldMainProps, ref) => {
    return (
      <motion.div
        className={`bg-cloud-white outline outline-1 transition-[outline-color] duration-200 rounded-[5px] py-3 px-6 ${
          errorMessage
            ? "outline-crimson"
            : " outline-cloud-white hover:outline-dark-sky-blue"
        }`}
      >
        {textarea ? (
          <textarea
            ref={ref as any}
            {...props}
            className="w-full resize-none bg-transparent outline-none body2 text-navy-blue"
          ></textarea>
        ) : (
          <input
            ref={ref as any}
            {...props}
            className="bg-transparent outline-none body2 text-navy-blue"
          ></input>
        )}
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

export default TextField;
