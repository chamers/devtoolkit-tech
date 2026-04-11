import MarketingNav from "@/components/nav/marketing-nav";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      {children}
    </div>
  );
};

export default MarketingLayout;
