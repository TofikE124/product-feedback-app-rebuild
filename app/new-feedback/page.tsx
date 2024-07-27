import Icon from "@/components/Icon";
import React from "react";
import Image from "next/image";

import LeftArrowIcon from "/public/shared/icon-arrow-left.svg";
import NewFeedbackIcon from "/public/shared/icon-new-feedback.svg";
import TextField from "@/components/TextField";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full h-screen bg-cloud-white lg:py-[92px] md:py-14 sm:py-[34px] grid">
      <div className="justify-self-center px-6 lgmd:w-[640px]">
        <Link
          href=".."
          className="flex gap-4 items-center mb-[68px] cursor-pointer"
        >
          <Icon icon={LeftArrowIcon} color="#4661E6"></Icon>
          Go Back
        </Link>
        <div className="relative bg-white p-10 pt-[52px] rounded-[10px] w-full">
          <Image
            src={NewFeedbackIcon}
            alt="New Feedback Icon"
            className="absolute top-0 -translate-y-1/2"
          ></Image>
          <h1 className="h1 text-navy-blue">Create New Feedback</h1>
          <div className="flex flex-col gap-6 mt-10 ">
            <div>
              <h4 className="h4 text-navy-blue mb-[2px]">Feedback Title</h4>
              <p className="text-[14px] font-normal text-steel-blue mb-4">
                Add a short, descriptive headline
              </p>
              <TextField></TextField>
            </div>
            <div>
              <h4 className="h4 text-navy-blue mb-[2px]">Category</h4>
              <p className="text-[14px] font-normal text-steel-blue mb-4">
                Choose a category for your feedback{" "}
              </p>
              <Dropdown
                options={["Feature"]}
                defaultOption="Feature"
                color="cloudy-white"
              ></Dropdown>
            </div>
            <div>
              <h4 className="h4 text-navy-blue mb-[2px]">Feedback Detail</h4>
              <p className="text-[14px] font-normal text-steel-blue mb-4">
                Include any specific comments on what should be improved, added,
                etc.
              </p>
              <TextField textarea></TextField>
            </div>
          </div>
          <div className="flex sm:flex-col gap-4 justify-end lgmd:mt-8 sm:mt-10">
            <Link href="..">
              <Button color="navy-blue" className="sm:w-full sm:order-1">
                Cancel
              </Button>
            </Link>
            <Button className="sm:w-full">Add Feedback</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
