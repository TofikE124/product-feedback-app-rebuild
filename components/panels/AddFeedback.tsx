import { useSession } from "next-auth/react";
import React from "react";
import Button from "../Button";
import OvalLoadingSpinner from "../OvalLoadingSpinner";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";

interface AddFeedbackProps {
  className?: string;
}

const AddFeedback = ({ className }: AddFeedbackProps) => {
  const { status } = useSession();
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push("/feedbacks/new-feedback");
      }}
      disabled={status != "authenticated"}
      className={twMerge("flex items-center gap-2", className)}
    >
      <div className="flex items-center gap-2">
        {status == "loading" ? <OvalLoadingSpinner></OvalLoadingSpinner> : null}
        <span>+ Add Feedback</span>
      </div>
    </Button>
  );
};

export default AddFeedback;
