"use client";
import FeedbackType from "@/components/FeedbackType";
import FeedbacksEmpty from "@/components/FeeedbacksEmpty";
import GoBack from "@/components/GoBack";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import AddFeedback from "@/components/panels/AddFeedback";
import UpVoteButton from "@/components/UpVote";
import { roadMapItemMap } from "@/constants/roadMap";
import { useLoadFeedbacks } from "@/hooks/useGetFeedbacks";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { Status } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import CommentsIcon from "/public/shared/icon-comments.svg";
import OvalLoadingSpinner from "@/components/OvalLoadingSpinner";

const page = () => {
  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen lg:py-[94px] md:pt-[94px] md:pb-[40px] sm:pb-[50px] ">
      <Header></Header>
      <Suspense>
        <RoadMapMain></RoadMapMain>
      </Suspense>
    </main>
  );
};

const Header = () => {
  return (
    <div className="lgmd:p-8 sm:p-6 rounded-[10px] sm:rounded-none bg-navy-blue">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <GoBack iconColor="#CDD2EE" className="text-white"></GoBack>
          <h1 className="h1 text-white">Roadmap</h1>
        </div>
        <AddFeedback></AddFeedback>
      </div>
    </div>
  );
};

const RoadMapMain = () => {
  const statuses = Object.values(Status);
  const [activeIndex, setActiveIndex] = useState(0);
  const { fetchStatus } = useLoadFeedbacks();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !document) return;

    const statusHeight = document.querySelector(
      `div[data-status-item][data-index="${activeIndex}"]`
    )?.clientHeight;

    ref.current.style.height = `${statusHeight || 0}px`;
  }, [activeIndex, fetchStatus]);

  return (
    <div className="relative lgmd:mt-12 md:mt-8 overflow-hidden">
      <MobileStatusNavigation
        activeIndex={activeIndex}
        activeStatus={statuses[activeIndex]}
        onItemClick={(index) => setActiveIndex(index)}
      ></MobileStatusNavigation>
      <div
        className="relative grid grid-cols-3 lg:gap-8 md:gap-[10px] sm:w-[300vw] sm:transition-[transform,height] sm:duration-300 lgmd:!translate-x-0"
        style={{ transform: `translate(${-100 * activeIndex}vw, 0)` }}
        ref={ref}
      >
        {statuses.map((status, index) => (
          <Suspense key={index}>
            <StatusItem
              status={status}
              isActive={index == activeIndex}
              index={index}
            ></StatusItem>
          </Suspense>
        ))}
      </div>
    </div>
  );
};

interface MobileStatusNavigationProps {
  onItemClick: (index: number) => void;
  activeIndex: number;
  activeStatus: Status;
}

const MobileStatusNavigation = ({
  onItemClick,
  activeIndex,
  activeStatus,
}: MobileStatusNavigationProps) => {
  const statuses = Object.values(Status);

  const { color } = roadMapItemMap[activeStatus];

  return (
    <div className="relative flex items-center w-full border-b border-solid border-[#8C92B3] mb-6 lgmd:hidden">
      <div
        className="absolute bottom-0 h-[4px] w-[33.33vw] transition-[left,background-color] duration-300"
        style={{ backgroundColor: color, left: `${(100 / 3) * activeIndex}%` }}
      ></div>
      {statuses.map((status, index) => (
        <Suspense key={index}>
          <MobileStatusNavigationItem
            onClick={() => onItemClick(index)}
            status={status}
          ></MobileStatusNavigationItem>
        </Suspense>
      ))}
    </div>
  );
};

interface MobileStatusNavigationItemProps {
  status: Status;
  onClick: () => void;
}

const MobileStatusNavigationItem = ({
  status,
  onClick,
}: MobileStatusNavigationItemProps) => {
  const { data: feedbacks, fetchStatus } = useLoadFeedbacks();
  const { label } = roadMapItemMap[status];

  return (
    <div className="py-5 text-center grow cursor-pointer" onClick={onClick}>
      <div className="text-navy-blue/40 border-y-red-300 font-bold flex items-center gap-2 justify-center">
        {label}{" "}
        {fetchStatus == "fetching" ? (
          <OvalLoadingSpinner color="#3a437466"></OvalLoadingSpinner>
        ) : (
          `(${getFeedbacksByStatus(feedbacks || [], status).length})`
        )}
      </div>
    </div>
  );
};

interface StatusItemProps {
  status: Status;
  isActive: boolean;
  index: number;
}

const StatusItem = ({ status, isActive, index }: StatusItemProps) => {
  const { data: feedbacks, fetchStatus } = useLoadFeedbacks();
  const { color, description, label } = roadMapItemMap[status];

  const filteredFeedbacks = getFeedbacksByStatus(feedbacks || [], status);

  return (
    <div
      className="flex flex-col gap-8 sm:px-6 sm:w-screen h-fit"
      data-status-item
      data-index={index}
    >
      <div>
        <h3 className="h3 text-navy-blue flex items-center gap-2">
          {label}{" "}
          {fetchStatus == "fetching" ? (
            <OvalLoadingSpinner color="#3a437466"></OvalLoadingSpinner>
          ) : (
            `(${filteredFeedbacks.length})`
          )}
        </h3>
        <p className="text-steel-blue body1">{description}</p>
      </div>
      {fetchStatus == "fetching" ? (
        <FeedbacksLoading status={status}></FeedbacksLoading>
      ) : (
        <div className="flex flex-col lg:gap-6 mdsm:gap-4">
          {filteredFeedbacks.length ? (
            filteredFeedbacks.map((feedback) => (
              <RoadmapFeedbackSummary
                to={`/feedbacks/${feedback.id}/comments`}
                feedback={feedback}
                status={status}
                key={feedback.id}
              ></RoadmapFeedbackSummary>
            ))
          ) : (
            <div className="lgmd:hidden">
              <FeedbacksEmpty></FeedbacksEmpty>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FeedbacksLoading = ({ status }: { status: Status }) => {
  return (
    <div className="flex flex-col lg:gap-6 mdsm:gap-4">
      <RoadmapFeedbackSummaryLoading
        status={status}
      ></RoadmapFeedbackSummaryLoading>
      <RoadmapFeedbackSummaryLoading
        status={status}
      ></RoadmapFeedbackSummaryLoading>
    </div>
  );
};

interface RoadmapFeedbackSummaryProps {
  feedback: FeedbackWith_UpVotes_Comments;
  status: Status;
  to?: string;
}

const RoadmapFeedbackSummary = ({
  feedback,
  status,
  to,
}: RoadmapFeedbackSummaryProps) => {
  const router = useRouter();
  const { color, label } = roadMapItemMap[status];

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (to) router.push(to);
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="bg-white lg:p-8 md:px-5 md:py-6 sm:p-6 rounded-[5px] border-t-[6px] border-solid"
      style={{ borderColor: color, cursor: to ? "pointer" : "default" }}
    >
      <div className="flex items-center gap-4 lg:mb-2 mdsm:mb-4">
        <div
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <p className="text-steel-blue body1">{label}</p>
      </div>
      <div className="flex flex-col lg:gap-1 mdsm:gap-2 lg:mb-4 md:mb-6 sm:mb-2">
        <h3 className="h3 text-navy-blue">{feedback.title}</h3>
        <p className="body1 text-steel-blue">{feedback.description}</p>
      </div>
      <div className="mb-4">
        <FeedbackType
          onClick={(e) => {
            e.stopPropagation();
          }}
          category={feedback.category}
        ></FeedbackType>
      </div>
      <div className="flex items-center justify-between w-full">
        <UpVoteButton feedbackId={feedback.id} horizontal></UpVoteButton>
        <div className="flex items-center gap-2">
          <Image src={CommentsIcon} alt="Comments Icon" />
          <p className="body1 text-navy-blue font-bold">
            {feedback.comments.length}
          </p>
        </div>
      </div>
    </div>
  );
};

interface RoadmapFeedbackSummaryLoadingProps {
  status: Status;
}

const RoadmapFeedbackSummaryLoading = ({
  status,
}: RoadmapFeedbackSummaryLoadingProps) => {
  const { color, label } = roadMapItemMap[status];

  return (
    <div
      className="bg-white lg:p-8 md:px-5 md:py-6 sm:p-6 rounded-[5px] border-t-[6px] border-solid"
      style={{ borderColor: color }}
    >
      <div className="flex items-center gap-4 lg:mb-2 mdsm:mb-4">
        <LoadingSkeleton
          width={80}
          height={25}
          className="h-[25px]"
        ></LoadingSkeleton>
      </div>
      <div className="flex flex-col lg:gap-1 mdsm:gap-2 lg:mb-4 md:mb-6 sm:mb-2">
        <LoadingSkeleton
          width={150}
          height={40}
          className="h-[40px]"
          containerClassName="md:hidden"
        ></LoadingSkeleton>
        <LoadingSkeleton
          width={250}
          height={25}
          className="h-[25px]"
          containerClassName="md:hidden"
        ></LoadingSkeleton>

        <LoadingSkeleton
          width={125}
          height={40}
          className="h-[40px]"
          containerClassName="hidden md:block"
        ></LoadingSkeleton>
        <LoadingSkeleton
          width={180}
          height={25}
          className="h-[25px]"
          containerClassName="hidden md:block"
        ></LoadingSkeleton>
      </div>
      <div className="mb-4">
        <LoadingSkeleton
          width={80}
          height={30}
          className="h-[30px]"
          borderRadius={10}
        ></LoadingSkeleton>
      </div>
      <div className="flex items-center justify-between w-full">
        <LoadingSkeleton
          width={70}
          height={40}
          className="h-[40px]"
          borderRadius={10}
        ></LoadingSkeleton>
        <LoadingSkeleton
          width={50}
          height={40}
          className="h-[40px]"
          borderRadius={10}
        ></LoadingSkeleton>
      </div>
    </div>
  );
};

const getFeedbacksByStatus = (
  feedbacks: FeedbackWith_UpVotes_Comments[],
  status: Status
) => {
  return feedbacks?.filter((feedback) => feedback.status == status) || [];
};

export default page;
