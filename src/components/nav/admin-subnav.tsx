import Link from "next/link";

interface AdminSubnavProps {
  current: "all" | "pending";
}

const AdminSubnav = ({ current }: AdminSubnavProps) => {
  return (
    <nav className="flex flex-wrap items-center gap-2">
      <Link
        href="/dashboard/admin"
        className={[
          "inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
          current === "all"
            ? "border-primary bg-primary text-primary-foreground"
            : "hover:bg-muted",
        ].join(" ")}
      >
        All resources
      </Link>

      <Link
        href="/dashboard/admin/submissions"
        className={[
          "inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors",
          current === "pending"
            ? "border-primary bg-primary text-primary-foreground"
            : "hover:bg-muted",
        ].join(" ")}
      >
        Pending submissions
      </Link>
    </nav>
  );
};

export default AdminSubnav;
