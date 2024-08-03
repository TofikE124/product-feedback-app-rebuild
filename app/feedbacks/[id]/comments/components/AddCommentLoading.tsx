import LoadingSkeleton from "@/components/LoadingSkeleton";

const AddCommentLoading = () => {
  return (
    <div className="px-8 py-2">
      <LoadingSkeleton
        height={64}
        className="h-[64px]"
        borderRadius={99999}
      ></LoadingSkeleton>
    </div>
  );
};

export default AddCommentLoading;
