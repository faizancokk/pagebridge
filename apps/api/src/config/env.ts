import { z } from "zod";
const schema = z.object({
  NODE_ENV: z.enum(["development","test","production"]).default("development"),
  PORT: z.coerce.number().default(4000), WEB_URL: z.string().url(), API_URL: z.string().url(),
  DATABASE_URL: z.string().min(1), REDIS_URL: z.string().min(1), SESSION_SECRET: z.string().min(32),
  TOKEN_ENCRYPTION_KEY: z.string().refine(v => { try { return Buffer.from(v,"base64").length === 32; } catch { return false; } }, "must be base64 for exactly 32 bytes"),
  GOOGLE_CLIENT_ID: z.string().min(1), GOOGLE_CLIENT_SECRET: z.string().min(1), GOOGLE_CALLBACK_URL: z.string().url(),
  META_APP_ID: z.string().min(1), META_APP_SECRET: z.string().min(1), META_CALLBACK_URL: z.string().url(),
  META_GRAPH_VERSION: z.string().regex(/^v\d+\.\d+$/), META_OFFICIAL_MERGE_URL: z.string().url(),
  EXTENSION_IDS: z.string().default("")
});
export const env = schema.parse(process.env);
export const isProd = env.NODE_ENV === "production";
export const extensionIds = env.EXTENSION_IDS.split(",").map(x=>x.trim()).filter(Boolean);
