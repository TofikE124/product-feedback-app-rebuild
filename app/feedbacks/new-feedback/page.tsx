"use client";

import FeedbackForm from "@/components/FeedbackForm";
import GoBack from "@/components/GoBack";
import { useCreateFeedback } from "@/hooks/useCreateFeedback";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { z } from "zod";
type feedbackType = z.infer<typeof feedbackSchema>;

const page = () => {
  return (
    <div className="w-full min-h-screen bg-cloud-white lg:py-[50px] md:py-[30px] sm:py-[20px] grid">
      <div className="justify-self-center px-6 lgmd:w-[640px]">
        <GoBack className="mb-[68px]"></GoBack>
        <NewFeedbackForm></NewFeedbackForm>
      </div>
    </div>
  );
};

const NewFeedbackForm = () => {
  const { mutate, isPending } = useCreateFeedback();

  const onSubmit = (data: feedbackType) => {
    mutate(data);
  };

  return <FeedbackForm onSubmit={onSubmit} isPending={isPending} />;
};

export default page;
