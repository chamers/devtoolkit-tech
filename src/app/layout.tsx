import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme";
import { ClerkProvider } from "@clerk/nextjs";
import { ResourceProvider } from "@/context/resource";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevToolkit: Your All-in-One Web Dev Resources Hub",
  description:
    "DevToolkit empowers developers of all levels to build web applications faster and easier. It provides a comprehensive suite of tools for front-end development, back-end development, digital design and code management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ResourceProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                }}
              />
            </ResourceProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
