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
    router.push("/resource/add");
  };

  return (
    <MenubarMenu>
      <MenubarTrigger asChild className="text-base font-normal">
        <span
          onClick={handleClick}
          className="flex cursor-pointer items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          <span>Add Resource</span>
        </span>
      </MenubarTrigger>
    </MenubarMenu>
  );
};

export default AddResourceButton;
