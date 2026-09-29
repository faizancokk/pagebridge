type Page={id:string;name:string;category:string|null;status:"ACTIVE"|"RESTRICTED"|"UNKNOWN";tasks:string[]};
type State="eligible"|"review"|"not_eligible";
export type Check={key:string;label:string;state:State;detail:string};
export function evaluate(source:Page,destination:Page){
  const canManage=(p:Page)=>p.tasks.some((x:string)=>["MANAGE","CREATE_CONTENT","MODERATE"].includes(x));
  const sameCategory=!!source.category&&!!destination.category&&source.category.toLowerCase()===destination.category.toLowerCase();
  const normalized=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
  const sameName=normalized(source.name)===normalized(destination.name);
  const checks:Check[]=[
    {key:"distinct",label:"Different source and destination",state:source.id!==destination.id?"eligible":"not_eligible",detail:source.id!==destination.id?"Two distinct Pages selected.":"Choose two different Pages."},
    {key:"authorization",label:"Account authorization",state:"eligible",detail:"Both Pages belong to an active connection owned by this app user."},
    {key:"permissions",label:"Page management permission",state:canManage(source)&&canManage(destination)?"eligible":"not_eligible",detail:canManage(source)&&canManage(destination)?"Management-capable tasks are present for both Pages.":"Meta did not report a management-capable task for both Pages."},
    {key:"status",label:"Page status",state:source.status==="RESTRICTED"||destination.status==="RESTRICTED"?"not_eligible":"review",detail:"The Pages API data used here cannot prove all Page-level restrictions; Meta must confirm."},
    {key:"name",label:"Names and purpose",state:sameName?"eligible":"review",detail:sameName?"Names match after normalization.":"Official rules require similar names and the same purpose; review this in Meta."},
    {key:"category",label:"Category compatibility",state:sameCategory?"eligible":"review",detail:sameCategory?"Categories match.":"Categories do not match or are unavailable; this is advisory, not Meta's final decision."},
    {key:"address",label:"Physical address",state:"review",detail:"If either Page has a physical location, Meta requires matching addresses. Confirm in Page settings."},
    {key:"business",label:"Business portfolio conditions",state:"review",detail:"Confirm both Pages are under the same Business Manager and the source is not its primary Page."},
    {key:"limitations",label:"Global/verified Page restrictions",state:"review",detail:"Global Pages cannot be merged; a verified Page cannot merge into an unverified Page. Confirm in Meta."},
    {key:"api",label:"API availability",state:"review",detail:"Direct API merge is not available. Continue through the official Meta/Facebook workflow."}
  ];
  const result=checks.some(c=>c.state==="not_eligible")?"not_eligible":"requires_user_action";
  return {result,checks,disclaimer:"This preflight uses available API metadata and is not a Meta approval. Meta makes the final decision."};
}
