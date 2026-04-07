import TopNav from "@/components/nav/top-nav";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky  top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <TopNav />
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default LandingPageLayout;
