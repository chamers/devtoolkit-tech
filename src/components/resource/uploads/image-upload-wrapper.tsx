"use client";
import dynamic from "next/dynamic";
const ImageUpload = dynamic(() => import("./image-upload"), { ssr: false });
export default ImageUpload;
