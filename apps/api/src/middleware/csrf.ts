import { randomToken } from "../lib/crypto.js";
import type { RequestHandler } from "express";
export const csrfToken:RequestHandler=(req,res)=>{req.session.csrfToken ||= randomToken(); res.json({csrfToken:req.session.csrfToken});};
export const requireCsrf:RequestHandler=(req,res,next)=>{
  if(["GET","HEAD","OPTIONS"].includes(req.method)) return next();
  const token=req.get("x-csrf-token");
  if(!token || token!==req.session.csrfToken) return res.status(403).json({error:"Invalid CSRF token"});
  next();
};
