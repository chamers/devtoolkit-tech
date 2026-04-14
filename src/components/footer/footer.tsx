import Image from "next/image";
import Link from "next/link";
import { Facebook, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="
        border-t
        border-border/60
        bg-gradient-to-b
        from-muted/40
        via-background/95
        to-muted/60
        backdrop-blur
        dark:from-black
        dark:via-background
        dark:to-black
      "
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center transition-opacity hover:opacity-90"
          >
            <Image
              src="/logos/logo.png"
              alt="DevToolkit logo"
              width={180}
              height={48}
              className="block h-auto w-auto dark:hidden"
            />
            <Image
              src="/logos/logo-dark.png"
              alt="DevToolkit logo"
              width={180}
              height={48}
              className="hidden h-auto w-auto dark:block"
            />
          </Link>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            DevToolkit is a curated platform for developers to discover useful
            tools, resources, and inspiration for building on the web.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-10 border-t border-border/50 pt-10 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Links
            </h4>

            <ul className="mt-4 space-y-3 text-sm list-none pl-0">
              <li>
                <Link
                  href="/resources"
                  className="text-foreground/85 transition-colors hover:text-foreground"
                >
                  Resources
                </Link>
              </li>

              <li>
                <span
                  className="cursor-not-allowed text-muted-foreground/60"
                  aria-disabled="true"
                  title="Coming soon"
                >
                  Blog
                </span>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-foreground/85 transition-colors hover:text-foreground"
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-foreground/85 transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Connect
            </h4>

            <div className="mt-4 flex items-center justify-center gap-4 sm:justify-start">
              <Link
                href="https://github.com/chamers/devtoolkit/"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex h-10 w-10 items-center justify-center rounded-full
                  border border-orange-600/70
                  bg-background/60
                  text-orange-600
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-orange-400/60
                  hover:bg-orange-500/10
                  hover:text-orange-400
                  hover:shadow-sm
                "
                aria-label="GitHub"
              >
                <Github size={18} />
              </Link>

              <Link
                href="https://www.facebook.com/profile.php?id=61573298830794"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex h-10 w-10 items-center justify-center rounded-full
                  border border-orange-600/70
                  bg-background/60
                  text-orange-600
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-orange-400/60
                  hover:bg-orange-500/10
                  hover:text-orange-400
                  hover:shadow-sm
                "
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} DevToolkit. All rights reserved.
          <p className="mt-2 text-xs tracking-wide">
            <span className="text-blue-700 dark:text-blue-400">
              Built for developers
            </span>
            <span className="mx-1 text-muted-foreground/60">•</span>
            <span className="text-orange-500 dark:text-orange-400">
              Curated with care
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
