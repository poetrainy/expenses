import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_API_URL || "",
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY || "",
});
