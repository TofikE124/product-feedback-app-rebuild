"use client";
import FeedbackType from "@/components/FeedbackType";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import UpVote from "@/components/UpVote";

import SuggestionsIcon from "/public/suggestions/icon-suggestions.svg";
import IllustrationEmpty from "/public/suggestions/illustration-empty.svg";
import CommentsIcon from "/public/shared/icon-comments.svg";
import { useState } from "react";

export default function Home() {
  return (
    <main className="lg:max-w-[1200px] lgmd:px-10 mx-auto h-screen flex mdsm:flex-col lgmd:gap-8 lg:py-[94px] md:pt-[94px] md:pb-[40px] sm:pb-[50px] ">
      <div className="grid grid-rows-[max-content,max-content] md:grid-cols-3 md:gap-[10px] lg:gap-6">
        <SuggestionsControls></SuggestionsControls>
      </div>
      <div className="flex flex-col gap-6 w-full h-full">
        <SuggestionsToolbar></SuggestionsToolbar>
        <div className="sm:px-6 h-full">
          <SuggestionsEmpty></SuggestionsEmpty>
        </div>
      </div>
    </main>
  );
}

const SuggestionsEmpty = () => {
  return (
    <div className="w-full h-full bg-white rounded-[10px] lg:py-[110px] sm:py-[76px]  grid place-items-center">
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
      <Dropdown
        options={["Most Upvotes"]}
        defaultOption="Most Upvotes"
        dropdownToggleLabel="Sort By"
      ></Dropdown>
      <Link href="/new-feedback" className="block ml-auto">
        <Button>+ Add Feedback</Button>
      </Link>
    </div>
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
    <div className="lg:h-[140px] md:basis-full flex justify-between items-center lgmd:p-6 sm:py-4 sm:px-6 z-20 lgmd:rounded-[10px] bg-cover lg:bg-[url(/suggestions/desktop/background-header.png)] md:bg-[url(/suggestions/tablet/background-header.png)] sm:bg-[url(/suggestions/mobile/background-header.png)]">
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
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 lgmd:hidden ${
          isOpened ? "opacity-100" : "opacity-0 hidden"
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
    if (value) newSearchParams.set("filter", value);
    else newSearchParams.delete("filter");

    router.push(`/?${newSearchParams.toString()}`);
  };

  const currentFilter = searchParams.get("filter");

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

const SuggestionSummary = () => {
  return (
    <div className="bg-white rounded-[10px] lgmd:p-8 sm:p-6 w-full">
      <div className="grid lgmd:grid-cols-[max-content,max-content,1fr] lgmd:gap-10 sm:grid-cols-2 sm:gap-y-4">
        <div className="lgmd:col-start-1 sm:row-start-2">
          <UpVote votes={112}></UpVote>
        </div>
        <div className="lgmd:col-start-2 flex flex-col">
          <h3 className="h3 text-navy-blue lgmd:mb-1 sm:mb-2">
            Add tags for solutions
          </h3>
          <p className="body1 text-steel-blue lgmd:mb-3 sm:mb-2">
            Easier to search for solutions based on a specific stack.
          </p>
          <FeedbackType text="Enhancement"></FeedbackType>
        </div>
        <div className="lgmd:col-start-3 sm:row-start-2 flex items-center gap-2 ml-auto self-center">
          <Image src={CommentsIcon} alt="Comments Icon" />
          <p className="body1 text-navy-blue font-bold">2</p>
        </div>
      </div>
    </div>
  );
};
