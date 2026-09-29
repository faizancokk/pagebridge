import type { RequestHandler } from "express";
export const requireUser:RequestHandler=(req,res,next)=>{
  if(!req.session.userId) return res.status(401).json({error:"Authentication required"});
  next();
};
