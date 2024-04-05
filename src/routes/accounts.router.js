import { Router } from "express";
import SesAccManager from "../dao/SesAccManager.js";

const accountsRouter = Router();
const manager = new SesAccManager();

accountsRouter.post("/", async (req, res) => {
  let message = await manager.createUser(req.body);
  res.send(message);
});

export default accountsRouter;
