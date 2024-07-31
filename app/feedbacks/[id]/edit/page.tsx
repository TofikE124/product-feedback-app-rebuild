"use client";
import FeedbackForm from "@/components/FeedbackForm";
import FeedbackFormLoading from "@/components/FeedbackFormLoading";
import GoBack from "@/components/GoBack";
import { useEditFeedback } from "@/hooks/useEditFeedback";
import { useGetFeedbackId } from "@/hooks/useGetFeedbackId";
import { useIsOwnFeedback } from "@/hooks/useIsOwnFeedback";
import { feedbackSchema } from "@/schemas/feedbackSchema";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { z } from "zod";

interface Props {
  params: { id: string };
}

type feedbackType = z.infer<typeof feedbackSchema>;

const page = ({ params: { id } }: Props) => {
  const { data: isOwn, fetchStatus: isOwnFetchStatus } = useIsOwnFeedback(id);

  const router = useRouter();

  useEffect(() => {
    if (isOwnFetchStatus == "idle" && !isOwn) {
      router.push("/");
    }
  }, [isOwn]);

  return (
    <div className="w-full h-screen bg-cloud-white lg:py-[92px] md:py-14 sm:py-[34px] grid">
      <div className="justify-self-center px-6 lgmd:w-[640px]">
        <GoBack className="mb-[68px]"></GoBack>
        <EditFeedbackForm feedbackId={id}></EditFeedbackForm>
      </div>
    </div>
  );
};

interface EditFeedbackFormProps {
  feedbackId: string;
}

const EditFeedbackForm = ({ feedbackId }: EditFeedbackFormProps) => {
  const { data: feedback, fetchStatus: feedbackFetchStatus } =
    useGetFeedbackId(feedbackId);

  const { mutate, isPending } = useEditFeedback(feedbackId);

  const onSubmit = (data: feedbackType) => {
    mutate(data);
  };

  return feedbackFetchStatus == "fetching" ? (
    <FeedbackFormLoading></FeedbackFormLoading>
  ) : (
    <FeedbackForm
      feedback={feedback}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  );
};

export default page;
