import crypto from "node:crypto";
import { env } from "../config/env.js";
const key = Buffer.from(env.TOKEN_ENCRYPTION_KEY,"base64");
export function encryptJson(value: unknown) {
  const iv=crypto.randomBytes(12), cipher=crypto.createCipheriv("aes-256-gcm",key,iv);
  const body=Buffer.concat([cipher.update(JSON.stringify(value),"utf8"),cipher.final()]);
  return [iv,cipher.getAuthTag(),body].map(x=>x.toString("base64url")).join(".");
}
export function decryptJson<T>(value:string):T {
  const [a,b,c]=value.split("."); if(!a||!b||!c) throw new Error("Invalid encrypted payload");
  const decipher=crypto.createDecipheriv("aes-256-gcm",key,Buffer.from(a,"base64url"));
  decipher.setAuthTag(Buffer.from(b,"base64url"));
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(c,"base64url")),decipher.final()]).toString("utf8"));
}
export const randomToken=(bytes=32)=>crypto.randomBytes(bytes).toString("base64url");
export const sha256=(v:string)=>crypto.createHash("sha256").update(v).digest("hex");
