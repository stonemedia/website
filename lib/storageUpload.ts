import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase.client";

export type UploadProgressCb = (pct: number) => void;

export async function uploadFileToPath(
  storagePath: string,
  file: File,
  onProgress?: UploadProgressCb
): Promise<{ storagePath: string; downloadUrl: string }> {
  const r = ref(storage, storagePath);
  const task = uploadBytesResumable(r, file);

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (!onProgress) return;
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress(pct);
      },
      reject,
      () => resolve()
    );
  });

  const downloadUrl = await getDownloadURL(task.snapshot.ref);
  return { storagePath, downloadUrl };
}