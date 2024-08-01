import { categoriesMap } from "@/constants/categories";
import { Category } from "@prisma/client";
import React from "react";

interface FeedbackTypeProps {
  category: Category;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const FeedbackType = ({
  category,
  active = false,
  onClick = () => {},
}: FeedbackTypeProps) => {
  const categoryItem = categoriesMap[category];

  return (
    <div
      onClick={onClick}
      className={`w-fit cursor-pointer select-none py-[6px] px-4 rounded-[10px] ${
        active ? "bg-dark-sky-blue" : "bg-soft-white hover:bg-[#CFD7FF]"
      }`}
    >
      <p className={`body3 ${active ? "text-white" : "text-dark-sky-blue"}`}>
        {categoryItem?.label || "All"}
      </p>
    </div>
  );
};

export default FeedbackType;
