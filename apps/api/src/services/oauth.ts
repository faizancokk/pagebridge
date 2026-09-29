import { env } from "../config/env.js";
import { jsonFetch } from "../lib/http.js";

type GoogleToken={access_token:string;id_token?:string}; type GoogleUser={sub:string;email:string;name:string;picture?:string;email_verified?:boolean};
type MetaToken={access_token:string;token_type:string;expires_in?:number}; type MetaUser={id:string;name:string};
export function googleAuthUrl(state:string){const q=new URLSearchParams({client_id:env.GOOGLE_CLIENT_ID,redirect_uri:env.GOOGLE_CALLBACK_URL,response_type:"code",scope:"openid email profile",state,prompt:"select_account"});return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;}
export async function exchangeGoogle(code:string){
  const token=await jsonFetch<GoogleToken>("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code,client_id:env.GOOGLE_CLIENT_ID,client_secret:env.GOOGLE_CLIENT_SECRET,redirect_uri:env.GOOGLE_CALLBACK_URL,grant_type:"authorization_code"})});
  const user=await jsonFetch<GoogleUser>("https://openidconnect.googleapis.com/v1/userinfo",{headers:{authorization:`Bearer ${token.access_token}`}});
  if(!user.email_verified) throw new Error("Google email is not verified"); return user;
}
export function metaAuthUrl(state:string){const q=new URLSearchParams({client_id:env.META_APP_ID,redirect_uri:env.META_CALLBACK_URL,response_type:"code",scope:"public_profile,email,pages_show_list",state});return `https://www.facebook.com/${env.META_GRAPH_VERSION}/dialog/oauth?${q}`;}
export async function exchangeMeta(code:string){
  const body=new URLSearchParams({client_id:env.META_APP_ID,client_secret:env.META_APP_SECRET,redirect_uri:env.META_CALLBACK_URL,code});
  const token=await jsonFetch<MetaToken>(`https://graph.facebook.com/${env.META_GRAPH_VERSION}/oauth/access_token`,{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body});
  const user=await jsonFetch<MetaUser>(`https://graph.facebook.com/${env.META_GRAPH_VERSION}/me?fields=id,name`,{headers:{authorization:`Bearer ${token.access_token}`}});
  return {token,user,expiresAt:token.expires_in?new Date(Date.now()+token.expires_in*1000):null};
}
