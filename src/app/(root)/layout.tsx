import TopNav from "@/components/nav/top-nav";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      {children}
    </div>
  );
};
export default LandingPageLayout;
