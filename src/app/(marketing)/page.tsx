import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import RotaryResourceCarousel from "@/components/resource/rotary-resource-carousel";
import { getLatestResourcesFromDB } from "@/app/actions/resource";
import {
  ArrowRight,
  Search,
  Star,
  PlusCircle,
  Smartphone,
  Share2,
  Link as LinkIcon,
  Cpu,
} from "lucide-react";

function getCarouselAccent(category?: string) {
  switch (category?.toLowerCase()) {
    case "frontend":
      return "from-sky-200/80 to-sky-100";
    case "backend":
      return "from-emerald-200/80 to-emerald-100";
    case "design":
      return "from-amber-200/80 to-amber-100";
    case "inspiration":
      return "from-rose-200/80 to-rose-100";
    case "assets":
      return "from-orange-200/80 to-orange-100";
    case "productivity":
      return "from-violet-200/80 to-violet-100";
    default:
      return "from-stone-200 to-stone-100";
  }
}

export default async function LandingPage() {
  const latestResourcesResult = await getLatestResourcesFromDB();

  const latestResources = latestResourcesResult.ok
    ? latestResourcesResult.data.resources
    : [];

  const carouselItems = latestResources.slice(0, 6).map((resource) => ({
    id: String(resource._id),
    title: resource.name,
    href: `/resources/${resource.slug}`,
    category: resource.category ?? "resource",
    tagline:
      typeof resource.tagline === "string"
        ? resource.tagline
        : "Explore this developer resource on DevToolkit.",
    accent: getCarouselAccent(resource.category),
  }));

  return (
    <div className="relative min-h-screen bg-stone-100 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-stone-300/60 min-h-[75vh]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: 'url("/images/hero.png")' }}
        />

        {/* Dark overlay (like original) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/50 to-black/70" />

        {/* Content */}
        <div className="relative z-10 mx-auto grid min-h-[75vh] max-w-7xl items-center gap-12 px-4 py-12 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Discover and promote software tools with{" "}
              <span className="inline-block">
                <span className="animate-pulse bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </h1>

            <p className="mx-auto mb-5 text-white">
              DevToolkit is a comprehensive hub of tools and resources to help
              developers build faster. Explore web development, backend, design,
              and code management resources all in one place.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/resources" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="
      w-full px-6 py-6 text-base
      bg-stone-100 text-stone-900
      hover:bg-stone-200
      transition-colors
    "
                >
                  Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/resources/add" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="
      w-full px-6 py-6 text-base
      bg-stone-100 text-stone-900
      hover:bg-stone-200
      transition-colors
    "
                >
                  Add Your Resource <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <RotaryResourceCarousel items={carouselItems} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-20">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-2xl font-bold md:mb-20 md:text-3xl">
            Why use DevToolkit?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<PlusCircle className="h-12 w-12 text-blue-500" />}
              title="Free Resource Listings"
              description="Submit your resource at no cost and help more developers discover your product, tool, or service."
            />

            <FeatureCard
              icon={<Search className="h-12 w-12 text-green-500" />}
              title="Easy Search"
              description="Find useful tools quickly with simple search and curated categories designed for developers."
            />

            <FeatureCard
              icon={<Star className="h-12 w-12 text-purple-500" />}
              title="Trusted Discovery"
              description="Explore handpicked resources and discover tools that can improve your workflow and development process."
            />
          </div>

          <div className="mt-20 text-center">
            <Link href="/resources">
              <Button
                size="lg"
                className="w-full px-4 py-2 text-lg md:w-auto md:px-8 md:py-4"
              >
                Start Browsing <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Benefits Section */}
      <section className="bg-blue-100 px-4 py-20 dark:bg-blue-900">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center text-2xl font-bold md:mb-20 md:text-3xl">
            Grow your visibility
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Cpu className="h-12 w-12 text-blue-500" />}
              title="AI-Assisted Content"
              description="Speed up your listing workflow with AI-assisted descriptions that help present your resource clearly."
            />

            <FeatureCard
              icon={<LinkIcon className="h-12 w-12 text-green-500" />}
              title="Stronger Backlinks"
              description="Gain additional visibility through links back to your product or website."
            />

            <FeatureCard
              icon={<Share2 className="h-12 w-12 text-purple-500" />}
              title="Better Reach"
              description="Help more developers discover your resource through a platform built specifically for technical audiences."
            />
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-600 px-4 py-20 text-white dark:bg-blue-800">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            Discover developer resources anytime, anywhere
          </h2>

          <div className="mb-8 flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center">
              <Search className="mb-2 h-12 w-12" />
              <span>Search developer tools</span>
            </div>

            <div className="flex flex-col items-center">
              <Smartphone className="mb-2 h-12 w-12" />
              <span>Mobile-friendly browsing</span>
            </div>

            <div className="flex flex-col items-center">
              <Share2 className="mb-2 h-12 w-12" />
              <span>Share useful resources</span>
            </div>
          </div>

          <p className="mx-auto mb-8 text-xl">
            Join developers discovering and sharing tools that make building
            software easier. Whether you want to explore new resources or
            promote your own, DevToolkit makes it simple.
          </p>

          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <Link href="/resources" className="w-full md:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full px-4 py-2 text-lg md:px-8 md:py-4"
              >
                Explore Resources <ArrowRight className="ml-2" />
              </Button>
            </Link>

            <Link href="/resources/add" className="w-full md:w-auto">
              <Button
                size="lg"
                className="w-full px-4 py-2 text-lg md:px-8 md:py-4"
              >
                Add Your Resource <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg bg-gray-50 p-6 shadow-md dark:bg-gray-700">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="mb-2 text-center text-xl font-semibold">{title}</h3>
      <p className="text-center text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}
