"use client";

import * as React from "react";
import {
  upload,
  ImageKitUploadNetworkError,
  ImageKitInvalidRequestError,
  ImageKitAbortError,
  ImageKitServerError,
} from "@imagekit/next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

type Props = {
  onUploaded: (urls: string[]) => void; // MULTIPLE URLs
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  buttonText?: string;
};

export default function ImageUpload({
  onUploaded,
  multiple = true,
  maxFiles = 10,
  accept = "image/*",
  buttonText = "Upload image(s)",
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState<number>(0);

  async function getAuth() {
    const res = await fetch("/api/imagekit", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch ImageKit auth");
    return res.json() as Promise<{
      signature: string;
      expire: number;
      token: string;
      publicKey: string;
    }>;
  }

  const handleUpload = async () => {
    const input = fileInputRef.current;
    if (!input || !input.files || input.files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    const files = Array.from(input.files).slice(0, maxFiles);
    setUploading(true);
    setProgress(0);

    try {
      const auth = await getAuth();

      // Upload sequentially so we can show an overall progress. (You can parallelize if you prefer.)
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const result = await upload({
          file,
          fileName: file.name,
          publicKey: auth.publicKey,
          signature: auth.signature,
          expire: auth.expire,
          token: auth.token,
          useUniqueFileName: true,
          onProgress: (evt) => {
            // progress per-file -> convert to overall %
            const filePct = evt.total ? (evt.loaded / evt.total) * 100 : 0;
            const overallPct = (i * 100 + filePct) / files.length;
            setProgress(overallPct);
          },
        });

        if (result?.url) urls.push(result.url);
      }

      if (urls.length) {
        onUploaded(urls);
        toast.success(
          `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`,
        );
      } else {
        toast.warning("No images uploaded");
      }
    } catch (error) {
      if (error instanceof ImageKitUploadNetworkError)
        toast.error("Network error during upload");
      else if (error instanceof ImageKitInvalidRequestError)
        toast.error("Invalid upload request");
      else if (error instanceof ImageKitAbortError)
        toast.warning("Upload aborted");
      else if (error instanceof ImageKitServerError)
        toast.error("Image server error");
      else toast.error("Unknown upload error");
      console.error(error);
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        ref={fileInputRef}
        accept={accept}
        multiple={multiple}
      />
      <Button onClick={handleUpload} disabled={uploading} variant="outline">
        {uploading ? "Uploading..." : buttonText}
      </Button>
      {uploading ? <Progress value={progress} className="h-2" /> : null}
    </div>
  );
}
