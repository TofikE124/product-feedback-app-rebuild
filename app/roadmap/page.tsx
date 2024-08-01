"use client";
import Button from "@/components/Button";
import FeedbackType from "@/components/FeedbackType";
import GoBack from "@/components/GoBack";
import UpVoteButton from "@/components/UpVote";
import { roadMapItemMap } from "@/constants/roadMap";
import { useLoadFeedbacks } from "@/hooks/useGetFeedbacks";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { FeedbackWith_UpVotes_Comments } from "@/types/Feedback";
import { Status, UpVote } from "@prisma/client";
import Link from "next/link";
import CommentsIcon from "/public/shared/icon-comments.svg";
import Image from "next/image";
import { useEffect, useState } from "react";

const page = () => {
  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen lg:py-[94px] md:pt-[94px] md:pb-[40px] sm:pb-[50px] ">
      <Header></Header>
      <RoadMapMain></RoadMapMain>
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
        <Link href="/feedbacks/new-feedback">
          <Button>+ Add Feedback</Button>
        </Link>
      </div>
    </div>
  );
};

const RoadMapMain = () => {
  const { data: feedbacks } = useLoadFeedbacks();
  const { data: myUpvotes } = useGetUserUpvotes();
  const statuses = Object.values(Status);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.log(activeIndex);
  }, [activeIndex]);

  return (
    <div className="relative lgmd:mt-12 md:mt-8 overflow-hidden">
      <MobileStatusNavigation
        activeIndex={activeIndex}
        activeStatus={statuses[activeIndex]}
        onItemClick={(index) => setActiveIndex(index)}
      ></MobileStatusNavigation>
      <div
        className="flex lg:gap-8 md:gap-[10px] sm:w-[300vw] sm:transition-[transform] sm:duration-300 lgmd:!translate-x-0"
        style={{ transform: `translate(${-100 * activeIndex}vw, 0)` }}
      >
        {statuses.map((status, index) => (
          <StatusItem
            status={status}
            feedbacks={getFeedbacksByStatus(feedbacks || [], status)}
            myUpvotes={myUpvotes}
            key={index}
          ></StatusItem>
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
        <MobileStatusNavigationItem
          onClick={() => onItemClick(index)}
          status={status}
          key={index}
        ></MobileStatusNavigationItem>
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
  const { data: feedbacks } = useLoadFeedbacks();
  const { label } = roadMapItemMap[status];

  return (
    <div className="py-5 text-center grow cursor-pointer" onClick={onClick}>
      <p className="text-navy-blue/40 border-y-red-300 font-bold">
        {label} ({getFeedbacksByStatus(feedbacks || [], status).length})
      </p>
    </div>
  );
};

interface StatusItemProps {
  feedbacks: FeedbackWith_UpVotes_Comments[];
  myUpvotes: UpVote[];
  status: Status;
}

const StatusItem = ({ feedbacks, myUpvotes, status }: StatusItemProps) => {
  const { color, description, label } = roadMapItemMap[status];

  return (
    <div className="flex flex-col gap-8 grow sm:px-6 sm:w-screen">
      <div>
        <h3 className="h3 text-navy-blue">
          {label} ({feedbacks.length})
        </h3>
        <p className="text-steel-blue body1">{description}</p>
      </div>
      <div className="flex flex-col lg:gap-6 mdsm:gap-4">
        {feedbacks.map((feedback) => (
          <RoadmapFeedbackSummary
            feedback={feedback}
            status={status}
            key={feedback.id}
          ></RoadmapFeedbackSummary>
        ))}
      </div>
    </div>
  );
};

interface RoadmapFeedbackSummaryProps {
  feedback: FeedbackWith_UpVotes_Comments;
  status: Status;
}

const RoadmapFeedbackSummary = ({
  feedback,
  status,
}: RoadmapFeedbackSummaryProps) => {
  const { color, label } = roadMapItemMap[status];

  return (
    <div
      className="bg-white lg:p-8 md:px-5 md:py-6 sm:p-6 rounded-[5px] border-t-[6px] border-solid"
      style={{ borderColor: color }}
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
        <FeedbackType category={feedback.category}></FeedbackType>
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

const getFeedbacksByStatus = (
  feedbacks: FeedbackWith_UpVotes_Comments[],
  status: Status
) => {
  return feedbacks?.filter((feedback) => feedback.status == status) || [];
};

export default page;
