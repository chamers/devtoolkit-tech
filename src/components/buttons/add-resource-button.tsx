"use client";

import { useResource } from "@/context/resource";
import { MenubarMenu, MenubarTrigger } from "../ui/menubar";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { defaultResourceFormState } from "@/utils/types/resource";

const AddResourceButton = () => {
  const { setResource, setInitialState } = useResource();
  const router = useRouter();

  const handleClick = () => {
    setResource(defaultResourceFormState);
    setInitialState(defaultResourceFormState);
    localStorage.removeItem("resource");
    router.push("/resources/add");
  };

  return (
    <MenubarMenu>
      <MenubarTrigger asChild className="text-base font-normal">
        <button
          type="button"
          onClick={handleClick}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Resource</span>
        </button>
      </MenubarTrigger>
    </MenubarMenu>
  );
};

export default AddResourceButton;
