import express from "express";
import path from "path";
import logger from "morgan";
import cors from "cors";
require("dotenv").config();

import eventsRouter from "./route/memory";

const port = 3001;

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/memory", eventsRouter);

console.log(`Started local server on localhost:${port} 🚀`);
app.listen(port);
