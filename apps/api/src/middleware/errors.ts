import type { ErrorRequestHandler } from "express";
export const errorHandler:ErrorRequestHandler=(err,_req,res,_next)=>{
  console.error(err instanceof Error ? err.message : "Unknown error");
  res.status(500).json({error:"Unexpected server error"});
};
