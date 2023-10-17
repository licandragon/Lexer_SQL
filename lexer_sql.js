const reserdas_condicionales = [
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
const reservadas_secuenciales = ["FROM", "SET"];

fs.readFile("querys.txt", "utf8", (err, data) => {
  var cadena_split = data.split("\n");
  cadena_split = cadena_split.map(element => {
    return element.trim();
  });
  
});
