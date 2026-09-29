const API=import.meta.env.VITE_API_URL || "http://localhost:4000";
let csrf="";
async function ensureCsrf(){if(csrf)return csrf;const r=await fetch(`${API}/api/csrf`,{credentials:"include"});if(!r.ok)throw new Error("Could not initialize secure session");csrf=(await r.json()).csrfToken;return csrf;}
export async function api<T>(path:string,init:RequestInit={}):Promise<T>{const method=(init.method||"GET").toUpperCase();const headers=new Headers(init.headers);if(!["GET","HEAD","OPTIONS"].includes(method))headers.set("x-csrf-token",await ensureCsrf());if(init.body)headers.set("content-type","application/json");const r=await fetch(`${API}${path}`,{...init,headers,credentials:"include"});if(r.status===204)return undefined as T;const body=await r.json().catch(()=>({error:"Unexpected response"}));if(!r.ok)throw new Error(body.error||"Request failed");return body;}
export const authUrl=(path:string)=>`${API}${path}`;
