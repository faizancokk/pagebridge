export class HttpError extends Error{constructor(public status:number,public payload:unknown){super(`Upstream request failed (${status})`)}}
export async function jsonFetch<T>(url:string, init?:RequestInit):Promise<T>{
  const response=await fetch(url,init); const text=await response.text();
  let data:unknown; try{data=JSON.parse(text);}catch{data={message:text};}
  if(!response.ok) throw new HttpError(response.status,data);
  return data as T;
}
