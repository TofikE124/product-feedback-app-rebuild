"use client";
import FeedbackType from "@/components/FeedbackType";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";

import FeedbackSummary from "@/components/FeedbackSummary";
import FeedbackSummaryLoading from "@/components/FeedbackSummaryLoading";
import { roadMapItemMap } from "@/constants/roadMap";
import { useLoadFeedbacks as useGetFeedbacks } from "@/hooks/useGetFeedbacks";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { SortingDirection, SortingProperty } from "@/types/Sorting";
import { getStatusCount } from "@/utils/getStatusCount";
import { Category, Status } from "@prisma/client";
import { Suspense, useState } from "react";
import SuggestionsIcon from "/public/suggestions/icon-suggestions.svg";
import FeedbacksEmpty from "@/components/FeeedbacksEmpty";

export default function Home() {
  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[94px] md:pt-[94px] md:pb-[40px] sm:pb-[50px] ">
      <div className="grid grid-rows-[max-content,max-content] md:grid-cols-3 md:gap-[10px] lg:gap-6 lg:max-w-[255px]">
        <SuggestionsControls></SuggestionsControls>
      </div>
      <div className="flex flex-col gap-6 w-full h-full">
        <Suspense>
          <SuggestionsToolbar></SuggestionsToolbar>
        </Suspense>
        <Suspense>
          <Feedbacks></Feedbacks>
        </Suspense>
      </div>
    </main>
  );
}

const SuggestionsToolbar = () => {
  const { data: feedbacks } = useGetFeedbacks();

  return (
    <div className="w-full flex items-center gap-4 lgmd:p-6 sm:py-4 sm:px-6 bg-navy-blue lgmd:rounded-[10px]">
      <Image
        src={SuggestionsIcon}
        alt="Suggestions Icon"
        className="sm:hidden"
      ></Image>
      <h3 className="h3 text-white sm:hidden">
        {feedbacks?.length} {feedbacks?.length == 1 ? "Feedback" : "Feedbacks"}
      </h3>
      <SortByDropdown></SortByDropdown>
      <Link href="/feedbacks/new-feedback" className="block ml-auto">
        <Button>+ Add Feedback</Button>
      </Link>
    </div>
  );
};

interface SortingOption {
  label: string;
  value: {
    property: SortingProperty;
    direction: SortingDirection;
  };
}

const SortByDropdown = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const options: SortingOption[] = [
    {
      label: "Most Upvotes",
      value: {
        property: SortingProperty.UP_VOTES,
        direction: SortingDirection.DESC,
      },
    },
    {
      label: "Least Upvotes",
      value: {
        property: SortingProperty.UP_VOTES,
        direction: SortingDirection.ASC,
      },
    },
    {
      label: "Most Comments",
      value: {
        property: SortingProperty.COMMENTS,
        direction: SortingDirection.DESC,
      },
    },
    {
      label: "Least Comments",
      value: {
        property: SortingProperty.COMMENTS,
        direction: SortingDirection.ASC,
      },
    },
  ];

  const handleValueChange = (option: SortingOption) => {
    const { value } = option;

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("sortBy", value.property);
    urlSearchParams.set("sortDirection", value.direction);

    router.push(`/feedbacks?${urlSearchParams.toString()}`);
  };

  const getSelectedOption = () => {
    const sortBy = searchParams.get("sortBy") as SortingProperty;
    const sortDirection = searchParams.get("sortDirection") as SortingDirection;

    return options.find(
      ({ value: { direction, property } }) =>
        direction == sortDirection && property == sortBy
    );
  };

  return (
    <Dropdown
      options={options}
      defaultOption={getSelectedOption() || options[0]}
      dropdownToggleLabel="Sort By"
      onValueChange={handleValueChange}
    ></Dropdown>
  );
};

const SuggestionsControls = () => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <SuggestionHeader
        isOpened={isOpened}
        onToggle={() => setIsOpened(!isOpened)}
      ></SuggestionHeader>
      <SuggestionsMenu
        onClose={() => setIsOpened(false)}
        isOpened={isOpened}
      ></SuggestionsMenu>
    </>
  );
};

interface SuggestionHeaderProps {
  isOpened: boolean;
  onToggle: () => void;
}

const SuggestionHeader = ({ isOpened, onToggle }: SuggestionHeaderProps) => {
  return (
    <div className="lg:h-[140px] md:basis-full flex justify-between lgmd:items-end sm:items-center lgmd:p-6 sm:py-4 sm:px-6 z-20 lgmd:rounded-[10px] bg-cover lg:bg-[url(/suggestions/desktop/background-header.png)] md:bg-[url(/suggestions/tablet/background-header.png)] sm:bg-[url(/suggestions/mobile/background-header.png)]">
      <div>
        <h2 className="h2 text-white">Tofik Elias</h2>
        <p className="body-2 text-white/75">Feedbak Board</p>
      </div>
      <div
        onClick={onToggle}
        className={`flex flex-col cursor-pointer lgmd:hidden ${
          isOpened ? "gap-1" : "gap-1"
        }`}
      >
        <div
          className={`w-[20px] h-[3px] bg-white transition-opacity duration-200 ${
            isOpened ? "opacity-0" : "opacity-100"
          } `}
        ></div>
        <div
          className={`w-[20px] h-[3px] bg-white transition-transform duration-500 ${
            isOpened ? "rotate-[45deg]" : ""
          }`}
        ></div>
        <div
          className={`w-[20px] h-[3px] bg-white transition-transform duration-500 ${
            isOpened ? "rotate-[135deg] translate-y-[-7px]" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

interface SuggestionsMenuProps {
  isOpened: boolean;
  onClose: () => void;
}

const SuggestionsMenu = ({ isOpened, onClose }: SuggestionsMenuProps) => {
  return (
    <>
      <div
        className={`md:col-span-2 flex lg:flex-col lg:gap-6 md:gap-[10px] sm:fixed sm:top-[78.5px] sm:bottom-0 sm:right-0 z-20 sm:bg-cloud-white sm:flex-col sm:gap-6 sm:p-6 sm:w-[270px] transition-transform duration-300  ${
          isOpened ? "sm:translate-x-0" : "sm:translate-x-full"
        }`}
      >
        <Suspense>
          <SuggestionFilter></SuggestionFilter>
        </Suspense>
        <Suspense>
          <RoadMap></RoadMap>
        </Suspense>
      </div>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 transition-all duration-300 lgmd:hidden ${
          isOpened ? "opacity-100 visible" : "opacity-0 invisible"
        } z-10`}
      ></div>
    </>
  );
};

const SuggestionFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = [null, ...Object.values(Category)];

  const handleLinkClick = (value: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) newSearchParams.set("category", value);
    else newSearchParams.delete("category");

    router.push(`/feedbacks?${newSearchParams.toString()}`, { scroll: false });
  };

  const currentFilter = searchParams.get("category");

  return (
    <div className="md:basis-full bg-white p-6 rounded-[10px]">
      <div className="flex flex-wrap gap-x-2 gap-y-[14px] items-center">
        {categories.map((category, index) => (
          <FeedbackType
            onClick={() => {
              handleLinkClick(category);
            }}
            category={category as Category}
            active={currentFilter == category}
            key={index}
          ></FeedbackType>
        ))}
      </div>
    </div>
  );
};

const RoadMap = () => {
  const { data: feedbacks } = useGetFeedbacks();
  const statuses = Object.values(Status);

  return (
    <div className="md:basis-full p-6 rounded-[10px] bg-white">
      <div className="flex items-center justify-between">
        <h3 className="h3 text-navy-blue">Roadmap</h3>
        <Link href="/roadmap" className="text-dark-sky-blue body3 underline">
          View
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        {statuses.map((status, index) => (
          <StatusItem
            color={roadMapItemMap[status].color}
            label={roadMapItemMap[status].label}
            count={getStatusCount(status, feedbacks || [])}
            key={index}
          ></StatusItem>
        ))}
      </div>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  color: string;
  count: number;
}

const StatusItem = ({ color, count, label }: StatusItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        ></div>
        <p className="body1 text-steel-blue">{label}</p>
      </div>
      <p className="body1 font-bold text-steel-blue">{count}</p>
    </div>
  );
};

const Feedbacks = () => {
  const { data: upVotes } = useGetUserUpvotes();
  const { data: feedbacks, fetchStatus } = useGetFeedbacks();

  if (fetchStatus == "fetching" && feedbacks?.length) {
    return (
      <div className="flex flex-col gap-5 mb-10 sm:px-6">
        {feedbacks.map((feedback) => (
          <FeedbackSummary
            to={`/feedbacks/${feedback.id}/comments`}
            feedback={feedback}
            key={feedback.id}
            myUpVotes={upVotes}
          ></FeedbackSummary>
        ))}
        <FeedbackSummaryLoading></FeedbackSummaryLoading>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 mb-10 sm:px-6">
      {fetchStatus == "fetching" ? (
        <>
          <FeedbackSummaryLoading></FeedbackSummaryLoading>
          <FeedbackSummaryLoading></FeedbackSummaryLoading>
          <FeedbackSummaryLoading></FeedbackSummaryLoading>
        </>
      ) : feedbacks?.length ? (
        feedbacks?.map((feedback) => (
          <FeedbackSummary
            to={`/feedbacks/${feedback.id}/comments`}
            feedback={feedback}
            key={feedback.id}
            myUpVotes={upVotes}
          ></FeedbackSummary>
        ))
      ) : (
        <FeedbacksEmpty></FeedbacksEmpty>
      )}
    </div>
  );
};
