import Image from "next/image";
import React from "react";
import UpArrow from "/public/shared/icon-arrow-up.svg";
import Icon from "./Icon";

interface UpVoteProps {
  votes: number;
  active?: boolean;
}

const UpVote = ({ active = false, votes }: UpVoteProps) => {
  return (
    <div
      className={`flex lgmd:flex-col sm:flex-row items-center lgmd:gap-2 sm:gap-[10px] lgmd:px-3 lgmd:pb-2 lgmd:pt-3 sm:py-[6px] sm:pr-3 sm:pl-4  w-fit rounded-[10px] cursor-pointer select-none ${
        active
          ? "bg-dark-sky-blue text-white"
          : "bg-soft-white hover:bg-[#CFD7FF] text-navy-blue"
      }`}
    >
      <Icon icon={UpArrow} color={active ? "#fff" : "#4661E6"}></Icon>
      <p className="text-[13px] font-bold tracking-[-0.18px]">{votes}</p>
    </div>
  );
};

export default UpVote;
