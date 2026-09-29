import { Router } from "express"; import { db } from "../lib/db.js"; import { requireUser } from "../middleware/auth.js";
export const pagesRouter=Router(); pagesRouter.use(requireUser);
pagesRouter.get("/",async(req,res)=>{const search=typeof req.query.search==="string"?req.query.search:"";const pages=await db.page.findMany({where:{connection:{userId:req.session.userId},name:{contains:search,mode:"insensitive"}},include:{connection:{select:{id:true,status:true,displayName:true}}},orderBy:{name:"asc"}});res.json(pages);});
