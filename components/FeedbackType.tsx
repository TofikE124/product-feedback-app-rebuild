import React from "react";

interface FeedbackTypeProps {
  text: string;
  active?: boolean;
}

const FeedbackType = ({ text, active = false }: FeedbackTypeProps) => {
  return (
    <div
      className={`w-fit cursor-pointer select-none py-[6px] px-4 rounded-[10px] ${
        active ? "bg-dark-sky-blue" : "bg-soft-white hover:bg-[#CFD7FF]"
      }`}
    >
      <p className={`body3 ${active ? "text-white" : "text-dark-sky-blue"}`}>
        {text}
      </p>
    </div>
  );
};

export default FeedbackType;
