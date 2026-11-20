import { FeaturedIcon } from "./FeaturedIcon";

export type FileIconType = "Document" | "Image";
export const fileIconType = (name: string): FileIconType => (/\.(jpe?g|png|gif|webp|heic)$/i.test(name) ? "Image" : "Document");

export function FileIcon({ Type = "Document" }: { Type?: FileIconType }) {
  return <FeaturedIcon Color="Gray" Size="sm" IconSwap={Type === "Image" ? "image-24-300-round" : "draft-24-300-round"} />;
}
