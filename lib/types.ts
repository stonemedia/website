export type ProjectStatus = "draft" | "published" | "archived";

export type ProjectDoc = {
  title: string;
  slug: string;

  serviceSlug: string;
  categorySlug: string;

  year?: number;
  meta?: string;
  languages?: string[];

  order: number;

  hlsPath?: string;

  // NEW: for source uploads
  sourceVideoPath?: string;
  sourceAudioPaths?: Record<string, string>;

  buildStatus?: "idle" | "uploading" | "building" | "done" | "error";
  buildError?: string;

  status: ProjectStatus;

  createdAt?: any;
  updatedAt?: any;
};