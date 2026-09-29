import { startPageSyncWorker } from "./jobs/pages.js";
const worker=startPageSyncWorker();worker.on("completed",job=>console.log(`Page sync ${job.id} completed`));worker.on("failed",(job,e)=>console.error(`Page sync ${job?.id} failed: ${e.message}`));
async function stop(){await worker.close();process.exit(0)}process.on("SIGTERM",stop);process.on("SIGINT",stop);
