import { AnimatePresence, motion } from "framer-motion";
import { ComponentProps, FormEvent, forwardRef, useState } from "react";
import Button from "./Button";

import Icon from "./Icon";
import WarningIcon from "/public/shared/icon-warning.svg";

type ExpandableTextFieldProps = {
  textarea?: boolean;
  actionLabel?: string;
  cancelLabel?: string;
  errorMessage?: string;
  onCancel?: () => Promise<boolean | void>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
} & (ComponentProps<"input"> & ComponentProps<"textarea">);

const ExpandableTextField = forwardRef(
  (
    {
      textarea,
      onCancel = async () => {},
      actionLabel = "Submit",
      cancelLabel = "Cancel",
      errorMessage,
      onSubmit,
      isLoading,
      ...props
    }: ExpandableTextFieldProps,
    ref
  ) => {
    const [isExpaned, setIsExpanded] = useState(false);

    const handleCancel = () => {
      onCancel();
      setIsExpanded(false);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      onSubmit(e);
      setIsExpanded(false);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div
          className={`py-4 px-4 border-solid  ${
            isExpaned || isLoading ? " rounded-[10px]" : "rounded-full"
          }
      ${
        errorMessage ? "border-2 border-crimson" : "border border-navy-blue/20"
      }`}
        >
          <ExpandableTextFieldMain
            ref={ref}
            textarea={textarea}
            isExpanded={isExpaned}
            onFocus={() => setIsExpanded(true)}
            {...props}
          ></ExpandableTextFieldMain>
          {isExpaned || isLoading ? (
            <ExpandableTextFieldButtons
              isLoading={isLoading}
              actionLabel={actionLabel}
              cancelLabel={cancelLabel}
              onCancel={handleCancel}
            ></ExpandableTextFieldButtons>
          ) : null}
        </div>
        <ExpandableTextFieldErrorMessage
          errorMessage={errorMessage}
        ></ExpandableTextFieldErrorMessage>
      </form>
    );
  }
);

type ExpandableTextFieldMainProps = {
  textarea?: boolean;
  isExpanded: boolean;
} & (ComponentProps<"input"> & ComponentProps<"textarea">);

const ExpandableTextFieldMain = forwardRef(
  (
    { onFocus, textarea, isExpanded, ...props }: ExpandableTextFieldMainProps,
    ref
  ) => {
    return (
      <div
        className="flex flex-col gap-1"
        style={{ height: isExpanded ? "auto" : "30px" }}
      >
        {textarea ? (
          <textarea
            ref={ref as any}
            onFocus={onFocus}
            className="bg-transparent w-full outline-none min-h-[30px] max-h-[150px]"
            style={{
              resize: isExpanded ? "vertical" : "none",
            }}
            {...props}
          ></textarea>
        ) : (
          <input
            ref={ref as any}
            onFocus={onFocus}
            className="bg-transparent w-full outline-none h-[24px]"
            {...props}
          ></input>
        )}
      </div>
    );
  }
);

interface ExpandableTextFieldErrorMessageProps {
  errorMessage?: string;
}

const ExpandableTextFieldErrorMessage = ({
  errorMessage,
}: ExpandableTextFieldErrorMessageProps) => {
  return (
    <AnimatePresence>
      {errorMessage ? (
        <motion.div
          initial={{ opacity: 0, translateY: "-5px" }}
          animate={{ opacity: 100, translateY: "0px" }}
          exit={{ opacity: 0, translateY: "-5px", height: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-4 py-2"
        >
          <Icon icon={WarningIcon} color="#d73737" />
          <h4 className="h4 text-crimson font-normal">{errorMessage}</h4>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

interface ExpandableTextFieldButtonsProps {
  actionLabel?: string;
  cancelLabel?: string;
  onAction?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const ExpandableTextFieldButtons = ({
  actionLabel,
  cancelLabel,
  onAction,
  onCancel,
  isLoading,
}: ExpandableTextFieldButtonsProps) => {
  return (
    <div className="w-full flex justify-end gap-2 py-1">
      <Button
        type="button"
        color="crimson"
        onClick={onCancel}
        className="rounded-[30px]"
      >
        {cancelLabel}
      </Button>
      <Button className="rounded-[30px]" onClick={onAction}>
        {isLoading ? "Loading..." : actionLabel}
      </Button>
    </div>
  );
};

ExpandableTextFieldMain.displayName = "ExpandableTextFieldMain";
ExpandableTextField.displayName = "ExpandableTextField";
export default ExpandableTextField;
