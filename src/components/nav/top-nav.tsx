import Link from "next/link";
import Image from "next/image";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import ModeToggle from "./mode-toggle";
import MobileNav from "./mobile-nav";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, LogIn } from "lucide-react";
import AddResourceButton from "../buttons/add-resource-button";

const TopNav = () => {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 items-center px-4">
        <div className="flex items-center gap-2">
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

        <div className="flex-1" />

        <div className="hidden md:block">
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

        <div className="ml-6 flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="inline-flex items-center text-sm font-medium hover:opacity-80"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>

          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
