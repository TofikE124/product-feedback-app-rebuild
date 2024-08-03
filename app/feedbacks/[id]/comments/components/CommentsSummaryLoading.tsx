import LoadingSkeleton from "@/components/LoadingSkeleton";

const CommentSummaryLoading = () => {
  return (
    <div className="relative flex gap-8 w-full items-start">
      <LoadingSkeleton
        width={40}
        height={40}
        borderRadius={99999}
        containerClassName="h-[40px] w-[40px]"
      ></LoadingSkeleton>

      <div className="flex flex-col w-full">
        <div className="relative flex flex-col w-full">
          <div className="flex items-end justify-between mb-4">
            <div className="flex gap-2">
              <LoadingSkeleton
                width={80}
                height={20}
                containerClassName="h-[20px]"
              ></LoadingSkeleton>
            </div>
          </div>
        </div>
        <LoadingSkeleton
          width={250}
          height={10}
          containerClassName="h-[10px]"
        ></LoadingSkeleton>
        <LoadingSkeleton
          width={250}
          height={10}
          containerClassName="h-[10px] mt-1"
        ></LoadingSkeleton>
        <div className="flex items-center gap-2 mt-2">
          <LoadingSkeleton
            width={16}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={50}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={16}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
          <LoadingSkeleton
            width={60}
            height={16}
            containerClassName="h-[16]"
            borderRadius={4}
          ></LoadingSkeleton>
        </div>
      </div>
    </div>
  );
};

export default CommentSummaryLoading;
