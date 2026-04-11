"use client";

import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { LogIn } from "lucide-react";

import ModeToggle from "./mode-toggle";
import MobileNav from "./mobile-nav";

const MarketingNav = () => {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 items-center gap-3 px-4">
        {/* Logo */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center">
            <span className="sr-only">DevToolkit</span>

            <Image
              src="/logos/logo.png"
              alt="DevToolkit"
              className="block h-auto w-auto dark:hidden"
              width={70}
              height={70}
              priority
            />

            <Image
              src="/logos/logo-dark.png"
              alt="DevToolkit (dark)"
              className="hidden h-auto w-auto dark:block"
              width={70}
              height={70}
              priority
            />
          </Link>
        </div>

        {/* Center nav */}
        <div className="hidden min-w-0 flex-1 md:flex md:justify-center">
          <nav className="flex items-center gap-6">
            <Link
              href="/resources"
              className="relative inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Resources
            </Link>
          </nav>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Desktop auth */}
          <div className="hidden items-center gap-2 md:flex">
            <SignedOut>
              {/* Sign in */}
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-medium hover:opacity-80"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </button>
              </SignInButton>

              {/* Get started */}
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
                >
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Shared controls */}
          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default MarketingNav;
