import { saveMemory } from "./../respository/memory";
import express from "express";

const router = express.Router();
router.get("/", async (request, response) => {
  await saveMemory({});
  response.sendStatus(200);
});

export default router;
