"use client";

import * as React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, LogIn, Menu, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import AddResourceButton from "../buttons/add-resource-button";
import SearchButton from "../buttons/search-button";

export default function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 flex flex-col gap-4">
            <div onClick={() => setOpen(false)}>
              <SearchButton />
            </div>

            <div onClick={() => setOpen(false)}>
              <AddResourceButton />
            </div>

            <div className="flex flex-col gap-2">
              <SignedIn>
                <Link
                  prefetch={false}
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {isAdmin && (
                  <Link
                    prefetch={false}
                    href="/dashboard/admin"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Sign in</span>
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
