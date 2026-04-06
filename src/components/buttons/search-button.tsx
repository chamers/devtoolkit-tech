"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchButton = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryFromUrl = searchParams.get("query") || "";
  const [query, setQuery] = useState(queryFromUrl);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/resources");
      return;
    }

    const params = new URLSearchParams();
    params.set("query", trimmedQuery);

    router.push(`/resources?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    router.push("/resources");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex w-full items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />

        <Input
          key={queryFromUrl}
          type="search"
          defaultValue={queryFromUrl}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search resources..."
          className="pl-9 pr-20"
          aria-label="Search resources"
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-10 h-8 w-8"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <Button type="submit" size="sm" className="absolute right-1 h-8">
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchButton;
