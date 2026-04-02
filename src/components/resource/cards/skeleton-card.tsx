import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-43.75 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 mx-1 w-6.25" />
        <Skeleton className="h-4 mx-1 w-6.25" />
      </div>
    </div>
  );
};
export default SkeletonCard;
