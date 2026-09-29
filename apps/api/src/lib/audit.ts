import { db } from "./db.js";
type LogStatus="SUCCESS"|"FAILURE"|"INFO";
export async function audit(userId:string|undefined,action:string,entityType:string,status:LogStatus,entityId?:string,metadata?:Record<string,unknown>){
  await db.activityLog.create({data:{userId,action,entityType,entityId,status,metadata:metadata ?? undefined}});
}
