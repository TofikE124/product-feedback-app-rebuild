import Skeleton, { SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingSkeleton = ({
  baseColor = "#F2F4FE",
  highlightColor = "#F8F9FE",
  ...props
}: SkeletonProps) => {
  return (
    <Skeleton
      baseColor={baseColor}
      highlightColor={highlightColor}
      {...props}
    />
  );
};

export default LoadingSkeleton;
