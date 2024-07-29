import LoadingSkeleton from "./LoadingSkeleton";

const FeedbackSummaryLoading = () => {
  return (
    <div className="bg-white rounded-[10px] h-fit lgmd:p-8 sm:p-6 w-full">
      <div className="grid lgmd:grid-cols-[max-content,max-content,1fr] lgmd:gap-10 sm:grid-cols-2 sm:gap-y-4">
        <div className="lgmd:col-start-1 sm:row-start-2">
          <UpvoteLoading />
        </div>
        <div className="lgmd:col-start-2 flex flex-col">
          <LoadingSkeleton
            baseColor="#F2F4FE"
            highlightColor="#F8F9FE"
            width={200}
            height={26}
            containerClassName="h-[26px]"
          ></LoadingSkeleton>
          <LoadingSkeleton
            baseColor="#F2F4FE"
            highlightColor="#F8F9FE"
            width={200}
            height={10}
            containerClassName="mt-1 h-[10px]"
          ></LoadingSkeleton>
          <LoadingSkeleton
            baseColor="#F2F4FE"
            highlightColor="#F8F9FE"
            width={150}
            height={10}
            className="h-[10px] mt-2"
          ></LoadingSkeleton>
          <LoadingSkeleton
            baseColor="#F2F4FE"
            highlightColor="#F8F9FE"
            width={80}
            height={30}
            containerClassName="mt-0 h-[30px]"
            borderRadius={10}
          ></LoadingSkeleton>
        </div>
        <div className="lgmd:col-start-3 sm:row-start-2 flex items-center gap-2 ml-auto self-center">
          <CommentsLoading></CommentsLoading>
        </div>
      </div>
    </div>
  );
};

const UpvoteLoading = () => {
  return (
    <>
      <LoadingSkeleton
        baseColor="#F2F4FE"
        highlightColor="#F8F9FE"
        width={40}
        height={53}
        borderRadius={10}
        containerClassName="sm:hidden h-[53px]"
      ></LoadingSkeleton>
      <LoadingSkeleton
        baseColor="#F2F4FE"
        highlightColor="#F8F9FE"
        width={70}
        height={32}
        borderRadius={10}
        containerClassName="lgmd:hidden h-[32px]"
      ></LoadingSkeleton>
    </>
  );
};

const CommentsLoading = () => {
  return (
    <>
      <LoadingSkeleton
        baseColor="#F2F4FE"
        highlightColor="#F8F9FE"
        width={30}
        height={40}
        containerClassName="mt-0 h-[40px] sm:hidden"
        borderRadius={10}
      ></LoadingSkeleton>
      <LoadingSkeleton
        baseColor="#F2F4FE"
        highlightColor="#F8F9FE"
        width={40}
        height={20}
        containerClassName="mt-0 h-[20px] lgmd:hidden"
      ></LoadingSkeleton>
    </>
  );
};

export default FeedbackSummaryLoading;
