import LoadingSkeleton from "@/components/LoadingSkeleton";
import CommentSummaryLoading from "./CommentsSummaryLoading";

interface CommentsLoadingProps {
  count?: number;
  showCommentsNumber?: boolean;
}

const CommentsLoading = ({
  count = 3,
  showCommentsNumber,
}: CommentsLoadingProps) => {
  const arr = new Array(count).fill(0);

  return (
    <div className="pt-6 px-8 pb-12">
      {showCommentsNumber ? (
        <LoadingSkeleton
          width={150}
          height={26}
          borderRadius={5}
          containerClassName="h-[26px] w-[150px] mb-6"
        ></LoadingSkeleton>
      ) : null}

      <div className="flex flex-col gap-4">
        {arr.map((x, index) => (
          <CommentSummaryLoading key={index}></CommentSummaryLoading>
        ))}
      </div>
    </div>
  );
};

export default CommentsLoading;
