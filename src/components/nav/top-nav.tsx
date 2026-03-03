import Link from "next/link";
import Image from "next/image";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import ModeToggle from "./mode-toggle";
import MobileNav from "./mobile-nav";

const TopNav = () => {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 items-center px-4">
        {/* Left: logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="sr-only">DevToolkit</span>

            <Image
              src="/logos/logo.png"
              alt="DevToolkit"
              className="block dark:hidden h-auto w-auto"
              width={70}
              height={70}
              priority
            />

            <Image
              src="/logos/logo-dark.png"
              alt="DevToolkit (dark)"
              className="hidden dark:block h-auto w-auto"
              width={70}
              height={70}
              priority
            />
          </Link>
        </div>

        {/* Spacer pushes right side */}
        <div className="flex-1" />

        {/* Desktop nav */}
        <div className="hidden md:block">
          <Menubar className="border-0 bg-transparent shadow-none p-0">
            <MenubarMenu>
              <MenubarTrigger className="text-base font-normal">
                Dashboard
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Right: actions (always right) */}
        <div className="ml-2 flex items-center gap-1">
          <ModeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
