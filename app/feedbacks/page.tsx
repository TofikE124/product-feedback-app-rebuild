"use client";
import FeedbackType from "@/components/FeedbackType";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";

import FeedbackSummary from "@/components/FeedbackSummary";
import FeedbackSummaryLoading from "@/components/FeedbackSummaryLoading";
import { useLoadFeedbacks as useGetFeedbacks } from "@/hooks/useGetFeedbacks";
import { useGetUserUpvotes } from "@/hooks/useGetUserUpvotes";
import { SortingDirection, SortingProperty } from "@/types/Sorting";
import { useState } from "react";
import SuggestionsIcon from "/public/suggestions/icon-suggestions.svg";
import IllustrationEmpty from "/public/suggestions/illustration-empty.svg";

export default function Home() {
  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto min-h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[94px] md:pt-[94px] md:pb-[40px] sm:pb-[50px] ">
      <div className="grid grid-rows-[max-content,max-content] md:grid-cols-3 md:gap-[10px] lg:gap-6 lg:max-w-[255px]">
        <SuggestionsControls></SuggestionsControls>
      </div>
      <div className="flex flex-col gap-6 w-full h-full">
        <SuggestionsToolbar></SuggestionsToolbar>
        <Feedbacks></Feedbacks>
      </div>
    </main>
  );
}

const FeedbacksEmpty = () => {
  return (
    <div className="w-full h-full bg-white rounded-[10px] lg:py-[110px] md:py-[90px] sm:py-[76px] grid place-items-center">
      <div className="max-w-[400px] text-center flex flex-col items-center">
        <Image
          className="mb-[50px]"
          src={IllustrationEmpty}
          alt="Illustration Empty"
        ></Image>
        <h1 className="h1 text-navy-blue">There is no feedback yet.</h1>
        <p className="body1 text-steel-blue mt-4">
          Got a suggestion? Found a bug that needs to be squashed? We love
          hearing about new ideas to improve our app.
        </p>
        <Link href="/new-feedback" className="block mt-6">
          <Button className="w-fit">+ Add Feedback</Button>
        </Link>
      </div>
    </div>
  );
};

const SuggestionsToolbar = () => {
  return (
    <div className="w-full flex items-center gap-4 lgmd:p-6 sm:py-4 sm:px-6 bg-navy-blue lgmd:rounded-[10px]">
      <Image
        src={SuggestionsIcon}
        alt="Suggestions Icon"
        className="sm:hidden"
      ></Image>
      <h3 className="h3 text-white sm:hidden ">6 Suggestions</h3>
      <SortByDropdown></SortByDropdown>
      <Link href="/new-feedback" className="block ml-auto">
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
        <SuggestionFilter></SuggestionFilter>
        <RoadMap></RoadMap>
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

  const filters = [
    { label: "All", value: null },
    { label: "UI", value: "UI" },
    { label: "UX", value: "UX" },
    { label: "Enhancement", value: "Enhancement" },
    { label: "Bug", value: "Bug" },
    { label: "Feature", value: "Feature" },
  ];

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
        {filters.map(({ label, value }, index) => (
          <FeedbackType
            onClick={() => {
              handleLinkClick(value);
            }}
            text={label}
            active={currentFilter == value}
            key={index}
          ></FeedbackType>
        ))}
      </div>
    </div>
  );
};

const RoadMap = () => {
  return (
    <div className="md:basis-full p-6 rounded-[10px] bg-white">
      <div className="flex items-center justify-between">
        <h3 className="h3 text-navy-blue">Roadmap</h3>
        <Link href="/" className="text-dark-sky-blue body3 underline">
          View
        </Link>
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <StatusItem color="#000" label="Planned" count={1}></StatusItem>
        <StatusItem color="#000" label="Planned" count={1}></StatusItem>
        <StatusItem color="#000" label="Planned" count={1}></StatusItem>
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
