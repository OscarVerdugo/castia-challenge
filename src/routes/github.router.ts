import express from "express";
import GitHubController from '../controllers/github.controller';

const router = express.Router();
const controller = new GitHubController();


router.get("/top-users/:search",controller.getTopUsers.bind(controller));

export default router;