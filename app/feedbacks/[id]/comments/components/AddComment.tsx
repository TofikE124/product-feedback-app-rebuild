import ExpandableTextField from "@/components/ExpandableTextField";
import { useCreateComment } from "@/hooks/useCreateComment";
import { usePanel } from "@/providers/PanelProvider";
import { createCommentSchema } from "@/schemas/createCommentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddCommentProps {
  feedbackId: string;
  onSubmitted?: () => void;
}

const AddComment = ({
  feedbackId,
  onSubmitted = () => {},
}: AddCommentProps) => {
  const { openPanel } = usePanel();
  const { data: session } = useSession();

  type createCommentType = z.infer<typeof createCommentSchema>;
  const {
    register,
    formState: { errors },
    clearErrors,
    handleSubmit,
    setValue,
    resetField,
  } = useForm<createCommentType>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      feedbackId,
      content: "",
    },
  });

  const { mutate, status } = useCreateComment(feedbackId);

  const onSubmit = async (data: createCommentType) => {
    mutate(data);
    resetField("content");
    onSubmitted();
  };

  const handleCancel = async () => {
    setValue("content", "");
    clearErrors("content");
  };

  return (
    <div className="px-8">
      <ExpandableTextField
        isLoading={status == "pending"}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={handleCancel}
        placeholder="Add a comment"
        actionLabel="Comment"
        textarea
        errorMessage={errors.content?.message}
        {...register("content")}
      ></ExpandableTextField>
    </div>
  );
};

export default AddComment;
