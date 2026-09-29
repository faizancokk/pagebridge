import { env } from "../config/env.js";
import { jsonFetch } from "../lib/http.js";
export type MetaPage={id:string;name:string;category?:string;picture?:{data?:{url?:string}};tasks?:string[]};
type PageResponse={data:MetaPage[];paging?:{next?:string}};
export async function listManagedPages(accessToken:string){
  const fields="id,name,category,picture,tasks"; let url=`https://graph.facebook.com/${env.META_GRAPH_VERSION}/me/accounts?fields=${encodeURIComponent(fields)}&limit=100`; const pages:MetaPage[]=[];
  for(let n=0;n<10&&url;n++){
    const result=await jsonFetch<PageResponse>(url,{headers:{authorization:`Bearer ${accessToken}`}}); pages.push(...result.data);
    if(result.paging?.next){const next=new URL(result.paging.next);next.searchParams.delete("access_token");url=next.toString()}else url="";
  }
  return pages;
}

export async function revokeMeta(accessToken:string){await jsonFetch(`https://graph.facebook.com/${env.META_GRAPH_VERSION}/me/permissions`,{method:"DELETE",headers:{authorization:`Bearer ${accessToken}`}});}
