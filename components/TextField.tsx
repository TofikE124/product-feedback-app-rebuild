"use client";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface TextfieldProps {
  errorMessage?: string;
}

const TextField = ({ errorMessage }: TextfieldProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={`bg-cloud-white outline outline-1 transition-[outline-color] duration-200 rounded-[5px] py-3 px-6 w-[255px] ${
          errorMessage
            ? "outline-crimson"
            : " outline-cloud-white hover:outline-dark-sky-blue"
        }`}
      >
        <input className="bg-transparent outline-none body2 text-navy-blue"></input>
      </div>
      <AnimatePresence>
        {errorMessage ? (
          <motion.h4
            initial={{ opacity: 0, translateY: "-5px" }}
            animate={{ opacity: 100, translateY: "0px" }}
            exit={{ opacity: 0, translateY: "-5px" }}
            transition={{ duration: 0.2 }}
            className="h4 text-crimson font-normal"
          >
            {errorMessage}
          </motion.h4>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default TextField;
