import Link from "next/link";
import { Plus } from "lucide-react";

const AddResourceButton = () => {
  return (
    <Link
      href="/resources/add"
      className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Plus className="mr-2 h-4 w-4" />
      <span>Add Resource</span>
    </Link>
  );
};

export default AddResourceButton;
