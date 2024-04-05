import { Router } from "express";

import ProductManager from "../dao/ProductManagerMongo.js";
import CartsManager from "../dao/CartsManagerMongo.js";

import { authUser } from "../utils.js";

const viewsRouter = Router();
const pManager = new ProductManager();
const cManager = new CartsManager();

viewsRouter.get("/products", async (req, res) => {
  let { limit, page, sort, query } = req.query;

  let response = await pManager.getProducts(limit, page, sort, query);

  if (response) {
    (response.prevLink =
      response.hasPrevPage &&
      `http://localhost:8080/products/?limit=${response.linkOptions.limit}${
        (response.linkOptions.query &&
          `&query=${response.linkOptions.query}`) ||
        ""
      }${
        response.linkOptions.sort ? "&sort=" + response.linkOptions.sort : ""
      }&page=${response.prevPage}`),
      (response.nextLink =
        response.hasNextPage &&
        `http://localhost:8080/products/?limit=${response.linkOptions.limit}${
          (response.linkOptions.query &&
            `&query=${response.linkOptions.query}`) ||
          ""
        }${
          response.linkOptions.sort ? "&sort=" + response.linkOptions.sort : ""
        }&page=${response.nextPage}`);

    delete response.linkOptions;

    let logueado;
    let dbUser;

    if (req.session?.user) {
      dbUser = req.session.user;
      logueado = true;
    } else {
      logueado = false;
    }

    res.render("home", { response, logueado, dbUser });
  } else {
    res.send("No existe la página");
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  let cart = await cManager.getCartById(req.params.cid);
  console.log(cart);

  if (!cart) {
    return res.send("No existe el carrito");
  }

  res.render("cart", { cart });
});

viewsRouter.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts");
});

viewsRouter.get("/register", (req, res) => {
  let logueado;
  req.session?.user ? (logueado = true) : (logueado = false);

  res.render("register", { logueado });
});

viewsRouter.get("/login", (req, res) => {
  let logueado;

  req.session?.user ? (logueado = true) : (logueado = false);
  let loginError = req.query.loginError || false;

  res.render("login", { logueado, loginError });
});

viewsRouter.get("/profile", authUser, (req, res) => {
  let logueado;
  let dbUser;

  if (req.session?.user) {
    dbUser = req.session.user;
    logueado = true;
  } else {
    logueado = false;
  }

  res.render("profile", { logueado, dbUser });
});

export default viewsRouter;
