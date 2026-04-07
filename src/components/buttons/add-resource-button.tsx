import Link from "next/link";
import { Plus } from "lucide-react";

const AddResourceButton = () => {
  return (
    <Link
      href="/resources/add"
      className="relative inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-600 after:transition-all after:duration-300 hover:after:w-full"
    >
      <Plus className="mr-2 h-4 w-4" />
      <span>Add Resource</span>
    </Link>
  );
};

export default AddResourceButton;
