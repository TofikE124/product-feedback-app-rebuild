import FeedbackFormLoading from "@/components/FeedbackFormLoading";
import GoBack from "@/components/GoBack";
import React from "react";

const loading = () => {
  return (
    <div className="w-full min-h-screen bg-cloud-white lg:py-[92px] md:py-14 sm:py-[34px] grid">
      <div className="justify-self-center px-6 lgmd:w-[640px]">
        <GoBack className="mb-[68px]"></GoBack>
        <FeedbackFormLoading></FeedbackFormLoading>
      </div>
    </div>
  );
};

export default loading;
