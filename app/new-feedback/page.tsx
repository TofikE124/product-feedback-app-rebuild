"use client";

import FeedbackForm from "@/components/FeedbackForm";
import GoBack from "@/components/GoBack";
import { useCreateFeedback } from "@/hooks/useCreateFeedback";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
type feedbackType = z.infer<typeof feedbackSchema>;

const page = () => {
  return (
    <div className="w-full h-screen bg-cloud-white lg:py-[92px] md:py-14 sm:py-[34px] grid">
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
