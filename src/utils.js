import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function authUser(req, res, next) {
  if (req.session?.user) {
    return next();
  } else {
    let logueado = false;
    return res.render("login", { logueado });
  }
}

export function authAdmin(req, res, next) {
  if (
    req.body.email == "adminCoder@coder.com" &&
    req.body.password == "adminCod3r123"
  ) {
    let user = req.body;
    user.first_name = "D1eg0";
    user.last_name = "Maradona";
    user.admin = true;
    req.session.user = user;
    return res.redirect("http://localhost:8080/products");
  } else {
    return next();
  }
}

/* 

Al usar algún filtro de Mongo en la búsqueda de productos, el link a las páginas siguiente y anterior en "api/products"
aparecía con las comillas escapadas y no se podía utilizar para navegar. Ej: http://...{"status":true} => http://...{/"status/":true}

Para resolverlo, el filtro debe enviarse sin comillas. Las siguientes funciones transforman al string en un JSON con formato correcto
buscando los índices de todos los ":" y "{" y agregando las comillas necesarias. Se pueden usar filtros complejos como {price:{$gt:2000}}
y este se convertirá en {"price":{"$gt":2000}} para realizar la búsqueda en Mongo.

*/

export function getInd(arr, val) {
  let indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

export function JSONify(str) {
  let strArr = [...str];

  let colonIndexes = getInd(strArr, ":");
  let counter = 0;
  colonIndexes.forEach((i) => {
    strArr.splice(i + counter, 0, '"');
    counter++;
  });

  let bracketIndexes = getInd(strArr, "{");
  counter = 0;
  bracketIndexes.forEach((i) => {
    strArr.splice(i + 1 + counter, 0, '"');
    counter++;
  });

  let JSONstr = strArr.join("");

  return JSONstr;
}
