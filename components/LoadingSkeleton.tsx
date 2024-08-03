import Skeleton, { SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { twMerge } from "tailwind-merge";

const LoadingSkeleton = ({
  baseColor = "#F2F4FE",
  highlightColor = "#F8F9FE",
  containerClassName,
  ...props
}: SkeletonProps) => {
  return (
    <Skeleton
      baseColor={baseColor}
      highlightColor={highlightColor}
      containerClassName={twMerge("flex", containerClassName)}
      {...props}
    />
  );
};

export default LoadingSkeleton;
