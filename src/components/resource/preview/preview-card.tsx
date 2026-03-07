"use client";

import Image from "next/image";
import {
  BadgeInfo,
  DollarSign,
  FolderKanban,
  Lightbulb,
  Tags,
  Waypoints,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Github, BookOpen } from "lucide-react";
import {
  getCategoryLabel,
  getPricingLabel,
  getUseCaseLabel,
} from "@/utils/constants/resource-taxonomy";
import { ResourceState } from "@/utils/types/resource";
import type { LucideIcon } from "lucide-react";

const PreviewCard = ({ resource }: { resource: ResourceState }) => {
  const categoryText = resource.category
    ? getCategoryLabel(resource.category)
    : "No category";

  const pricingText = resource.pricing
    ? getPricingLabel(resource.pricing)
    : "Free";

  const taglineText = resource.tagline || "Short summary of the resource";
  const descriptionText =
    resource.description || "Resource description will appear here...";
  const tagsText =
    resource.tags.length > 0 ? resource.tags.join(", ") : "No tags yet";
  const alternativesText =
    resource.alternatives.length > 0
      ? resource.alternatives.join(", ")
      : "No alternatives yet";
  const useCasesText =
    resource.useCases.length > 0
      ? resource.useCases.map(getUseCaseLabel).join(", ")
      : "No use cases yet";

  return (
    <Card className="group not-odd:mx-auto w-full max-w-2xl border bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-px">
      <CardHeader className="flex flex-row items-center gap-4">
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

      <CardContent className="space-y-1">
        <p className="line-clamp-3 text-sm pb-4">{descriptionText}</p>

        <div className="space-y-2">
          <InfoItem icon={BadgeInfo} label="Tagline" text={taglineText} />
          <InfoItem icon={DollarSign} label="Pricing" text={pricingText} />
          <div className="flex items-start gap-2 text-sm">
            <Tags className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <span className="text-muted-foreground shrink-0">Tags:</span>

            <div className="flex flex-wrap gap-1">
              {resource.tags.length > 0 ? (
                <>
                  {resource.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}

                  {resource.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{resource.tags.length - 4} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground text-xs">
                  No tags yet
                </span>
              )}
            </div>
          </div>
          <InfoItem
            icon={Waypoints}
            label="Alternatives"
            text={alternativesText}
          />
          <div className="flex items-start gap-2 text-sm">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <span className="text-muted-foreground shrink-0">Use Cases:</span>

            <div className="flex flex-wrap gap-1">
              {resource.useCases.length > 0 ? (
                <>
                  {resource.useCases.slice(0, 3).map((useCase) => (
                    <Badge key={useCase} variant="outline" className="text-xs">
                      {getUseCaseLabel(useCase)}
                    </Badge>
                  ))}

                  {resource.useCases.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{resource.useCases.length - 3} more
                    </Badge>
                  )}
                </>
              ) : (
                <span>{useCasesText}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-3 border-t mt-3 opacity-80 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-px">
        {resource.website && (
          <Button variant="outline" size="sm" className="gap-2">
            <Globe className="h-4 w-4" />
            Website
          </Button>
        )}

        {resource.githubUrl && (
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        )}

        {resource.documentationUrl && (
          <Button variant="outline" size="sm" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Docs
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PreviewCard;

function InfoItem({
  icon: Icon,
  label,
  text,
}: {
  icon: LucideIcon;
  label: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

      <span className="text-muted-foreground shrink-0">{label}:</span>

      <span className="line-clamp-2">{text}</span>
    </div>
  );
}
