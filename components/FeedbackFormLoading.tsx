import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";

const FeedbackFormLoading = () => {
  return (
    <div className="relative bg-white p-10 pt-[52px] rounded-[10px] w-full">
      <LoadingSkeleton
        width={56}
        height={56}
        containerClassName="h-[56px] absolute top-0 -translate-y-1/2"
        borderRadius={9999}
      ></LoadingSkeleton>
      <LoadingSkeleton
        width={300}
        height={36}
        containerClassName="h-[36px]"
      ></LoadingSkeleton>

      <div className="flex flex-col gap-6 mt-10 ">
        <div>
          <LoadingSkeleton
            width={150}
            height={20}
            containerClassName="h-[20px]"
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={400}
            height={48}
            containerClassName="h-[48px]"
          ></LoadingSkeleton>
        </div>
        <div>
          <LoadingSkeleton
            width={150}
            height={20}
            containerClassName="h-[20px]"
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={400}
            height={48}
            containerClassName="h-[48px]"
          ></LoadingSkeleton>
        </div>
        <div>
          <LoadingSkeleton
            width={150}
            height={20}
            containerClassName="h-[20px]"
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={400}
            height={48}
            containerClassName="h-[48px]"
          ></LoadingSkeleton>
        </div>
        <div>
          <LoadingSkeleton
            width={150}
            height={20}
            containerClassName="h-[20px]"
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={450}
            height={100}
            containerClassName="h-[48px]"
          ></LoadingSkeleton>
        </div>
        <div className="flex w-full justify-end gap-4">
          <LoadingSkeleton
            width={100}
            height={44}
            containerClassName="h-[20px]"
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={150}
            height={44}
            containerClassName="h-[48px]"
          ></LoadingSkeleton>
        </div>
      </div>
    </div>
  );
};

export default FeedbackFormLoading;
