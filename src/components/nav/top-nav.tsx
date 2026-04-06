import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, LogIn } from "lucide-react";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import ModeToggle from "./mode-toggle";
import MobileNav from "./mobile-nav";
import AddResourceButton from "../buttons/add-resource-button";
import SearchButton from "../buttons/search-button";

const TopNav = () => {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 items-center gap-3 px-4">
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

        <div className="hidden min-w-0 flex-1 md:flex md:justify-center">
          <div className="w-full max-w-2xl">
            <SearchButton />
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Menubar className="flex gap-2 border-0 bg-transparent p-0 shadow-none">
            <AddResourceButton />

            <SignedIn>
              <MenubarMenu>
                <MenubarTrigger asChild className="text-base font-normal">
                  <Link
                    prefetch={false}
                    href="/dashboard"
                    className="flex items-center"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            </SignedIn>
          </Menubar>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <SignedOut>
            <div className="hidden md:block">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-medium hover:opacity-80"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <ModeToggle />
          <MobileNav />
        </div>
      </div>
      <div className="border-t px-4 py-3 md:hidden">
        <SearchButton />
      </div>
    </header>
  );
};

export default TopNav;
