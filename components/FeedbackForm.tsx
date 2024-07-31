import { Category, Feedback } from "@prisma/client";
import Link from "next/link";
import { useForm, UseFormReturn } from "react-hook-form";
import Button from "./Button";
import Dropdown from "./Dropdown";
import TextField from "./TextField";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { z } from "zod";
import Image from "next/image";

import NewFeedbackIcon from "/public/shared/icon-new-feedback.svg";
import EditFeedbackIcon from "/public/shared/icon-edit-feedback.svg";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import FeedbackFormLoading from "./FeedbackFormLoading";

type feedbackType = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onSubmit: (data: feedbackType) => void;
  isPending: boolean;
  feedback?: Feedback;
}

const FeedbackForm = ({ onSubmit, isPending, feedback }: FeedbackFormProps) => {
  const options = Object.values(Category).map((category) => ({
    label: category,
    value: category,
  }));

  const {
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<feedbackType>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      ...feedback,
    },
  });

  const getOptionFromCategory = (category: Category) => {
    return options.find(({ value }) => value == category);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative bg-white p-10 pt-[52px] rounded-[10px] w-full"
    >
      <Image
        src={feedback ? EditFeedbackIcon : NewFeedbackIcon}
        alt={feedback ? "Edit feedback icon" : "New feedback icon "}
        className="absolute top-0 -translate-y-1/2 object-cover"
        width={56}
        height={56}
      ></Image>
      <h1 className="h1 text-navy-blue">
        {feedback ? `Editing ${feedback.title}` : "Create New Feedback"}
      </h1>
      <div className="flex flex-col gap-6 mt-10 ">
        <div>
          <h4 className="h4 text-navy-blue mb-[2px]">Feedback Title</h4>
          <p className="text-[14px] font-normal text-steel-blue mb-4">
            Add a short, descriptive headline
          </p>
          <TextField
            {...register("title")}
            errorMessage={errors.title?.message}
          ></TextField>
        </div>
        <div>
          <h4 className="h4 text-navy-blue mb-[2px]">Category</h4>
          <p className="text-[14px] font-normal text-steel-blue mb-4">
            Choose a category for your feedback{" "}
          </p>
          <Dropdown
            options={options}
            defaultOption={
              feedback ? getOptionFromCategory(feedback?.category) : options[0]
            }
            color="cloudy-white"
            onValueChange={({ value }) => {
              setValue("category", value);
            }}
          ></Dropdown>
        </div>
        <div>
          <h4 className="h4 text-navy-blue mb-[2px]">Feedback Detail</h4>
          <p className="text-[14px] font-normal text-steel-blue mb-4">
            Include any specific comments on what should be improved, added,
            etc.
          </p>
          <TextField
            textarea
            errorMessage={errors.description?.message}
            {...register("description")}
          ></TextField>
        </div>
      </div>
      <div className="flex sm:flex-col gap-4 justify-end lgmd:mt-8 sm:mt-10">
        <Link href="..">
          <Button
            type="button"
            color="navy-blue"
            className="sm:w-full sm:order-1"
          >
            Cancel
          </Button>
        </Link>
        <Button className="sm:w-full" disabled={isPending}>
          {feedback
            ? isPending
              ? "Editing Feedback..."
              : "Edit Feedback"
            : isPending
            ? "Adding Feedback..."
            : "Add Feedback"}
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
