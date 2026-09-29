export type User={id:string;email:string;name:string;avatar?:string};
export type Connection={id:string;metaUserId:string;displayName?:string;status:string;expiresAt?:string;createdAt:string;_count:{pages:number}};
export type Page={id:string;facebookPageId:string;name:string;category?:string;image?:string;status:string;tasks:string[];lastSyncedAt:string;connection:{id:string;status:string;displayName?:string}};
export type Merge={id:string;status:string;createdAt:string;errorMessage?:string;eligibilityResult?:unknown;sourcePage:{name:string;facebookPageId:string};destinationPage:{name:string;facebookPageId:string};user:{name:string;email:string}};
