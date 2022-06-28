import express from "express";

import githubRouter from "./github.router";

const router = express.Router();

router.use("/github", githubRouter);

export default router;