import express from "express";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessions.router.js";
import accountsRouter from "./routes/accounts.router.js";

import handlebars from "express-handlebars";

import { Server } from "socket.io";

import ProductManager from "./dao/ProductManagerMongo.js";

import mongoose from "mongoose";

import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import { __dirname } from "./utils.js";

const manager = new ProductManager();

// Mongoose

mongoose.connect(
  "mongodb+srv://landosergio:aorAdam888@codercluster.mr4aged.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster"
);

//Express
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://landosergio:aorAdam888@codercluster.mr4aged.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=CoderCluster",
    }),
    secret: "Coder123",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.static(__dirname + "/public"));

const httpServer = app.listen(8080, () =>
  console.log("Escuchando en puerto 8080")
);

//Socket.io
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

  let products = await manager.getProducts();
  socketServer.emit("realTimeProducts", products);
});

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Router
app.get("/", (req, res) => {
  res.redirect("http://localhost:8080/login");
});

app.use("/", viewsRouter);
app.use(
  "/api/products",
  (req, res, next) => {
    req.socketServer = socketServer;
    return next();
  },
  productsRouter
);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/accounts", accountsRouter);
