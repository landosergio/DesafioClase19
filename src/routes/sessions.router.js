import { Router } from "express";
import SesAccManager from "../dao/SesAccManager.js";

import { authAdmin } from "../utils.js";

const sessionsRouter = Router();
const manager = new SesAccManager();

sessionsRouter.post("/", authAdmin, async (req, res) => {
  let dbUser = await manager.login(req.body);

  if (dbUser) {
    req.session.user = dbUser;
    res.redirect("http://localhost:8080/products");
  } else {
    res.redirect("http://localhost:8080/login/?loginError=true");
  }
});

sessionsRouter.get("/", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("http://localhost:8080/login/");
    } else {
      res.send({ status: "Logout error", body: err });
    }
  });
});

export default sessionsRouter;
