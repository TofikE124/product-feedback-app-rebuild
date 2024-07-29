import Skeleton, { SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const LoadingSkeleton = (props: SkeletonProps) => {
  return <Skeleton {...props} />;
};

export default LoadingSkeleton;
