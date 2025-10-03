export const getMimeType = (uri: string) => {
  // Remove query params and get extension
  const cleanUri = uri.split("?")[0];
  const ext = cleanUri.split(".").pop()?.toLowerCase() ?? "";

  const mimeMap = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
    svg: "image/svg+xml",
  };

  return mimeMap[ext] || "application/octet-stream";
};
