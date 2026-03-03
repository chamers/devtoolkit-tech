import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import Link from "next/link";
import Image from "next/image";
import ModeToggle from "./mode-toggle";
const TopNav = () => {
  return (
    <Menubar>
      <div className="flex-none">
        <MenubarMenu>
          {/* LOGO */}

          <Link href="/">
            <span className="sr-only">DevToolkit</span>

            {/* Light mode logo */}
            <Image
              src="/logos/logo.png"
              alt="DevToolkit"
              className="block dark:hidden h-auto w-auto hover:cursor-pointer"
              width={70}
              height={70}
            />

            {/* Dark mode logo */}
            <Image
              src="/logos/logo-dark.png"
              alt="DevToolkit (dark)"
              className="hidden dark:block h-auto w-auto hover:cursor-pointer"
              width={70}
              height={70}
            />
          </Link>
        </MenubarMenu>
      </div>
      <div className="flex flex-grow items-center justify-end gap-1">
        <MenubarMenu>
          <MenubarTrigger className="text-base font-normal">
            Dashboard
          </MenubarTrigger>
          {/* <MenubarContent className="w-64">
            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
          </MenubarContent> */}
        </MenubarMenu>
        <MenubarMenu>
          <ModeToggle />
        </MenubarMenu>
      </div>
    </Menubar>
  );
};
export default TopNav;
