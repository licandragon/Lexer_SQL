const fs = require("fs");
const tokens = [];

/*const reservadas_condicionales = [
  "WHERE",
  "ORDER BY",
  "LIMIT",
  "LIKE",
  "BETWEEN",
];
const reservadas_order = ["ASC", "DESC"];
const condicionales = ["<", ">", ">=", "<=", "=", "NOT", "OR", "AND"];
const operador = ["*"];
const reservadas_iniciales = [
  "SELECT",
  "INSERT",
  "CREATE",
  "UPDATE",
  "DELETE",
  "ALTER",
  "USE",
];
const reservadas_secuenciales = ["FROM", "SET"];*/
const comillas = ["'", '"', "`"];

const caracteres_especiales = [
  "*",
  "+",
  "-",
  "/",
  "%",
  "=",
  "<",
  ">",
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "&",
  "|",
  "^",
  ";",
  ",",
  ":",
];

function descomponerQuery(query) {
  const componentes = [];
  let componente = "";
  let en_comillas = false;

  for (let i = 0; i < query.length; i++) {
    const caracter = query[i];

    if (comillas.includes(caracter)) {
      // Cambiamos el estado de en_comillas cuando encontramos comillas
      en_comillas = !en_comillas;
      if (componente.trim() !== "") {
        componentes.push(componente.trim());
      }
      componentes.push(caracter);
      componente = "";
    } else if (caracter === " " && !en_comillas) {
      // Si encontramos un espacio fuera de las comillas, guardamos el componente actual y lo reiniciamos
      if (componente.trim() !== "") {
        componentes.push(componente.trim());
      }
      componente = "";
    } else if (caracteres_especiales.includes(caracter) && !en_comillas) {
      // Si encontramos un operador de comparación, lo tratamos como un componente separado
      if (componente.trim() !== "") {
        componentes.push(componente.trim());
      }
      componentes.push(caracter);
      componente = "";
    } else {
      // Agregamos el carácter al componente actual
      componente += caracter;
    }
  }

  // Agregamos el último componente si no está vacío
  if (componente.trim() !== "") {
    componentes.push(componente.trim());
  }

  return componentes;
}

fs.readFile("querys.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  var query_split = data.split("\n");
  query_split = query_split.map((element) => {
    return element.trim();
  });

  query_split.forEach(function (query) {
    console.log(descomponerQuery(query));
  });
});
