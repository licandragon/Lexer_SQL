const fs = require("fs");
const tokens = {};
const querys_descompuestos = [];
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
    } else if (esNumero(caracter) && esNumero(componente)) {
      //si encontramos un numero y el componente tambien es un numero tambien lo agregamos
      componente += caracter;
      if (query[i + 1] === ".") {
        //Si el siguiente caracter es un "." se añade como parte del componente (numero punto flotante)
        componente += query[i + 1];
        i++;
      }
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

//funcion que determina si es un numero
function esNumero(num) {
  return /^[+-]?\d+(\.\d+)?$/.test(num);
}

function tokenizar(lista_tokens, query) {
  const tokenizado = [];
  for (let i = 0; i < query.length; i++) {
    const componente = query[i];
    //console.log(componente)
    let llaveEncontrada = null;
    for (const llave in lista_tokens) {
      //console.log(lista_tokens[llave])

      if (lista_tokens[llave] === componente.toUpperCase()) {
        llaveEncontrada = llave;
        break; // Si encontraste la llave, puedes salir del bucle
      }
    }

    if (llaveEncontrada) {
      tokenizado.push(llaveEncontrada);
    } else if (esNumero(componente)) {
      tokenizado.push("777");
    } else {
      tokenizado.push("999");
    }
  }
  return tokenizado;
}

// Promesa para leer el archivo de tokens
const leer_tokens = new Promise((resolve, reject) => {
  fs.readFile("sqlkeywords.txt", "utf8", (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

// Promesa para leer el archivo de querys
const leer_querys = new Promise((resolve, reject) => {
  fs.readFile("querys.txt", "utf8", (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

//Se resuelven las promesas de forma paralela
Promise.all([leer_tokens, leer_querys])
  .then(([tokensData, querysData]) => {
    //Se procesa el archivo de tokens para crear el diccionario
    let tokens_split = tokensData.split("\n");
    tokens_split = tokens_split.map((element) => {
      return element.trim();
    });
    tokens_split.forEach((token) => {
      const token_parts = token.split(":").map((element) => {
        return element.trim();
      });
      const llave = token_parts[0];
      const valor = token_parts[1];
      if (llave !== "") {
        tokens[llave] = valor;
      }
    });

    //Se procesa los querys para ser descompuestos en sus componentes y se filtran los elementos vacios
    let query_split = querysData.split("\n").filter((element) => element.trim().length > 0);
    query_split = query_split.map((element) => {
      return element.trim();
    });
  
    query_split.forEach(function (query) {
      querys_descompuestos.push(descomponerQuery(query));
    });
    //console.log(tokens);
    // console.log(querys_descompuestos);
    // console.log(tokenizar(tokens, querys_descompuestos[0]));
    const tokenizados = [];
    querys_descompuestos.forEach(function (query, indice) {
      tokenizados.push(tokenizar(tokens, query));
      console.log(
        `Query ${indice + 1}: ${query} \n Version Tokenizada: ${tokenizar(
          tokens,
          query
        )}`
      );
    });
  })

  .catch((err) => {
    console.error(err);
  });
