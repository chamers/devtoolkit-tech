import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryLabel } from "@/utils/constants/resource-taxonomy";
import type { SerializedResource } from "@/app/actions/resource";

interface SingleResourceCardProps {
  resource: SerializedResource;
}

const SingleResourceCard = ({ resource }: SingleResourceCardProps) => {
  const categoryText = resource.category
    ? getCategoryLabel(resource.category)
    : "No category";

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm">
          {resource.logo ? (
            <Image
              src={resource.logo}
              alt={resource.name || "Resource logo"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center">
              <span className="px-1 text-[10px] text-muted-foreground">
                No logo
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <CardTitle className="line-clamp-1 text-lg">
            {resource.name || "Resource name"}
          </CardTitle>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {categoryText}
          </p>
        </div>
      </CardHeader>
      <CardContent className="text-sm mb-4"></CardContent>
    </Card>
  );
};

export default SingleResourceCard;
