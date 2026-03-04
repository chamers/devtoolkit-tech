"use client";
import { useResource } from "@/context/resource";
const AddResourcePage = () => {
  const { resource } = useResource();
  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="flex flex-col lg:w-1/2 p-4 lg:order-last lg:flex lg:justify-center lg:items-center">
        Preview
      </div>
      <div className="flex flex-col lg:w-1/2 p-4 lg:order-first lg:flex lg:justify-center lg:items-center">
        Form
        <pre>{JSON.stringify(resource, null, 4)}</pre>
      </div>
    </div>
  );
};
export default AddResourcePage;
