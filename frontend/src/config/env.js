/**
 * Centralized environment configuration module.
 * Instead of reading process.env scattered throughout the application,
 * import from this module.
 */

export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  NEXT_PUBLIC_FILES_URL: process.env.NEXT_PUBLIC_FILES_URL || "",
  

};
