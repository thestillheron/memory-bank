import {
  saveMemory,
  getMemoryView,
  fetchAllMemories,
} from "./../respository/memory";
import express from "express";
import {
  NewMemory,
  validateNewMemory,
} from "../../../Shared/src/dtos/newMemory";

const router = express.Router();
router.post("/", async (request, response) => {
  const requestBody: NewMemory = request.body;
  const validation = validateNewMemory(requestBody);
  if (validation.length > 0) {
    throw new Error(validation.join(" | "));
  }
  const result = await saveMemory(requestBody);
  response.json(result);
  response.sendStatus(200);
});

router.get("/:memoryId", async (request, response) => {
  const memoryId = request.param("memoryId");
  if (!memoryId) {
    throw new Error("Please specify the memory id");
  }
  const result = await getMemoryView(memoryId);
  response.json(result);
  response.sendStatus(200);
});

router.get("/", async (request, response) => {
  const result = await fetchAllMemories();
  response.json(result);
  response.sendStatus(200);
});

export default router;
