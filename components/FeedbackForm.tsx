import { feedbackSchema } from "@/schemas/feedbackSchema";
import { Category, Feedback, Status } from "@prisma/client";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "./Button";
import Dropdown from "./Dropdown";
import TextField from "./TextField";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import EditFeedbackIcon from "/public/shared/icon-edit-feedback.svg";
import NewFeedbackIcon from "/public/shared/icon-new-feedback.svg";
import { useDeleteFeedback } from "@/hooks/useDeleteFeedback";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type feedbackType = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onSubmit: (data: feedbackType) => void;
  isPending: boolean;
  feedback?: Feedback;
}

const FeedbackForm = ({ onSubmit, isPending, feedback }: FeedbackFormProps) => {
  const { mutate, status: deleteStatus } = useDeleteFeedback(
    feedback?.id || ""
  );
  const router = useRouter();

  const categories = Object.values(Category).map((category) => ({
    label: category,
    value: category,
  }));

  const statuses = Object.values(Status).map((status) => ({
    label: status,
    value: status,
  }));

  const {
    register,
    formState: { errors, isDirty },
    setValue,
    handleSubmit,
  } = useForm<feedbackType>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      ...feedback,
    },
  });

  const getOptionFromCategory = (category: Category) => {
    return categories.find(({ value }) => value == category);
  };

  const getOptionFromStatus = (status: Status) => {
    return statuses.find(({ value }) => value == status);
  };

  const handleDelete = () => {
    mutate();
  };

  const handleCancel = () => {
    router.back();
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
            options={categories}
            defaultOption={
              feedback
                ? getOptionFromCategory(feedback?.category)
                : categories[0]
            }
            color="cloudy-white"
            onValueChange={({ value }) => {
              setValue("category", value, { shouldDirty: true });
            }}
            zIndex={6}
          ></Dropdown>
        </div>
        <div>
          <h4 className="h4 text-navy-blue mb-[2px]">Status</h4>
          <p className="text-[14px] font-normal text-steel-blue mb-4">
            Change feedback state
          </p>
          <Dropdown
            options={statuses}
            defaultOption={
              feedback ? getOptionFromStatus(feedback?.status) : statuses[0]
            }
            color="cloudy-white"
            onValueChange={({ value }) => {
              setValue("status", value, { shouldDirty: true });
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
        {feedback ? (
          <Button
            type="button"
            onClick={handleDelete}
            color="crimson"
            className="lgmd:mr-auto sm:order-2"
            disabled={deleteStatus == "pending"}
          >
            {deleteStatus == "pending" ? "Deleting..." : "Delete"}
          </Button>
        ) : null}
        <Button
          onClick={handleCancel}
          type="button"
          color="navy-blue"
          className="sm:w-full sm:order-1"
        >
          Cancel
        </Button>
        <Button
          className="sm:w-full"
          disabled={isPending || (feedback && !isDirty)}
        >
          {feedback
            ? isPending
              ? "Saving Changes..."
              : "Save Changes"
            : isPending
            ? "Adding Feedback..."
            : "Add Feedback"}
        </Button>
      </div>
    </form>
  );
};

export default FeedbackForm;
