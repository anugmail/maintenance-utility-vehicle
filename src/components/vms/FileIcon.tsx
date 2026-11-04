/* Figma: "_File icon" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/_File icon.json
   variant: Type = Document (draft) | Image (image) — เลือกตามนามสกุลไฟล์ (fileIconType) ตาม upload() ใน core.js
   ค่า: Featured icon Color=Gray Size=sm (36 · พื้น gray-100 · ไอคอน 24 gray-500) */
import { FeaturedIcon } from "./FeaturedIcon";

export type FileIconType = "Document" | "Image";
export const fileIconType = (name: string): FileIconType => (/\.(jpe?g|png|gif|webp|heic)$/i.test(name) ? "Image" : "Document");

export function FileIcon({ Type = "Document" }: { Type?: FileIconType }) {
  return <FeaturedIcon Color="Gray" Size="sm" IconSwap={Type === "Image" ? "image-24-300-round" : "draft-24-300-round"} />;
}
