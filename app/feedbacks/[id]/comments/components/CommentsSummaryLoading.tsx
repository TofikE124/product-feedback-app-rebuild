import LoadingSkeleton from "@/components/LoadingSkeleton";
import ReplyLeftBorder from "./ReplyLeftBorder";
import ImageLeftBorder from "./ImageLeftBorder";

interface CommentSummaryLoadingProps {
  showLeftBorder?: boolean;
  showImageLeftBorder?: boolean;
}

const CommentSummaryLoading = ({
  showLeftBorder,
  showImageLeftBorder,
}: CommentSummaryLoadingProps) => {
  return (
    <div className="relative flex gap-8 w-full items-start py-2">
      <div className="relative">
        <LoadingSkeleton
          width={40}
          height={40}
          borderRadius={99999}
          containerClassName="h-[40px] w-[40px]"
        ></LoadingSkeleton>
        {showImageLeftBorder ? <ImageLeftBorder></ImageLeftBorder> : null}
      </div>

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
      {showLeftBorder ? <ReplyLeftBorder></ReplyLeftBorder> : null}
    </div>
  );
};

export default CommentSummaryLoading;
