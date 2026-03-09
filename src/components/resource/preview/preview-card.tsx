"use client";

import Image from "next/image";
import {
  BadgeInfo,
  DollarSign,
  Lightbulb,
  Tags,
  Waypoints,
  Globe,
  Github,
  BookOpen,
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
import {
  getCategoryLabel,
  getPricingLabel,
  getUseCaseLabel,
} from "@/utils/constants/resource-taxonomy";
import type { LucideIcon } from "lucide-react";
import type {
  ResourceFormState,
  ResourceUseCase,
} from "@/utils/types/resource";

const commaSeparatedToArray = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const PreviewCard = ({ resource }: { resource: ResourceFormState }) => {
  const tags = commaSeparatedToArray(resource.tags);
  const alternatives = commaSeparatedToArray(resource.alternatives);
  const useCases = commaSeparatedToArray(resource.useCases);

  const categoryText = resource.category
    ? getCategoryLabel(resource.category)
    : "No category";

  const pricingText = resource.pricing
    ? getPricingLabel(resource.pricing)
    : "Free";

  const taglineText = resource.tagline || "Short summary of the resource";
  const descriptionText =
    resource.description || "Resource description will appear here...";

  const alternativesText =
    alternatives.length > 0 ? alternatives.join(", ") : "No alternatives yet";

  const useCasesText =
    useCases.length > 0
      ? useCases
          .map((useCase) => getUseCaseLabel(useCase as ResourceUseCase))
          .join(", ")
      : "No use cases yet";

  return (
    <Card className="group not-odd:mx-auto w-full max-w-2xl border bg-card shadow-sm transition-all hover:-translate-y-px hover:shadow-md">
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
        <p className="line-clamp-3 pb-4 text-sm">{descriptionText}</p>

        <div className="space-y-2">
          <InfoItem icon={BadgeInfo} label="Tagline" text={taglineText} />
          <InfoItem icon={DollarSign} label="Pricing" text={pricingText} />

          <div className="flex items-start gap-2 text-sm">
            <Tags className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Tags:</span>

            <div className="flex flex-wrap gap-1">
              {tags.length > 0 ? (
                <>
                  {tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}

                  {tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{tags.length - 4} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-xs text-muted-foreground">
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
            <span className="shrink-0 text-muted-foreground">Use Cases:</span>

            <div className="flex flex-wrap gap-1">
              {useCases.length > 0 ? (
                <>
                  {useCases.slice(0, 3).map((useCase) => (
                    <Badge key={useCase} variant="outline" className="text-xs">
                      {getUseCaseLabel(useCase as ResourceUseCase)}
                    </Badge>
                  ))}

                  {useCases.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{useCases.length - 3} more
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

      <CardFooter className="mt-3 flex flex-wrap gap-2 border-t pt-3 opacity-80 transition-all duration-200 group-hover:-translate-y-px group-hover:opacity-100">
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
      <span className="shrink-0 text-muted-foreground">{label}:</span>
      <span className="line-clamp-2">{text}</span>
    </div>
  );
}
