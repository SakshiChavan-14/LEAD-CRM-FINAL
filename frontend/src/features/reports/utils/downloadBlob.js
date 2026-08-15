/**
 * Download a binary blob as a file in the browser.
 *
 * @param {Blob|ArrayBuffer} blobData - The blob object returned from the API
 * @param {string} filename - The file name (including extension)
 */
export function downloadBlob(blobData, filename) {
  if (!blobData) return;

  const blob = blobData instanceof Blob ? blobData : new Blob([blobData]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

/**
 * Format helper for export filenames
 */
export function getExportFilename(prefix, entityName, range, format) {
  const extMap = {
    csv: "csv",
    excel: "xlsx",
    pdf: "pdf",
  };
  const extension = extMap[format?.toLowerCase()] || format || "csv";

  // Sanitize entity name (replace spaces and special chars with hyphens)
  const sanitized = (entityName || "")
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const parts = ["GMU"];
  if (prefix) parts.push(prefix);
  if (sanitized) parts.push(sanitized);
  if (range) parts.push(range);

  return `${parts.join("-")}.${extension}`;
}
