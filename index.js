// Crear un servidor en Node
const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Jimp = require("jimp");

app.listen(3000, () => {
  console.log("Servidor inicializado en el puerto 3000");
});

// El servidor debe disponibilizar una ruta raíz que devuelva un HTML con el formulario
// para el ingreso de la URL de la imagen a tratar.
// Los estilos de este HTML deben ser definidos por un archivo CSS alojado en el
// servidor.

app.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  fs.readFile("index.html", "utf8", (error, data) => {
    res.write(data);
    res.end();
  });
});

app.get("/style", (req, res) => {
  res.writeHead(200, { "Content-type": "text/css" });
  fs.readFile(__dirname + "/assets/css/style.css", (error, css) => {
    res.write(css);
    res.end(css);
  });
});

// El formulario debe redirigir a otra ruta del servidor que deberá procesar la imagen
// tomada por la URL enviada del formulario con el paquete Jimp. La imagen debe ser
// procesada en escala de grises, con calidad a un 60% y redimensionada a unos 350px
// de ancho.
// La imagen alterada debe ser almacenada con un nombre incluya una porción de un
// UUID y con extensión “jpg”, por ejemplo: 3dcb6d.jpg.


app.get("/subir", (req, res) => {
  const { urlImg } = req.query;
  Jimp.read(urlImg, (error, data) => {
    data
      .resize(350, Jimp.AUTO)
      .quality(60)
      .greyscale()
      .writeAsync(uuidv4().slice(0, 6) + ".jpg")
      .then(() => {
        res.writeHead(200, { "Content-type": "image/jpeg" });
        fs.readFile(uuidv4().slice(0, 6) + ".jpeg", (error, data) => {
          res.end(data);
        });
      });
  });
});