import TopNav from "@/components/nav/top-nav";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-10 transition-opacity duration-300"
        style={{ backgroundImage: 'url("/images/hero.png")' }}
      />

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <TopNav />
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default LandingPageLayout;
