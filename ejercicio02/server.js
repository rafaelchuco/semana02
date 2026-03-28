const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

function renderView(res, viewName, data) {
  const filePath = path.join(__dirname, "views", viewName);

  fs.readFile(filePath, "utf8", (err, templateData) => {
    if (err) {
      res.statusCode = 500;
      res.end("Error interno del servidor");
      return;
    }

    const template = handlebars.compile(templateData);
    const html = template(data);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(html);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    const data = {
      title: "Servidor con Handlebars",
      welcomeMessage: "Bienvenido al laboratorio de Node.js",
      day: new Date().toLocaleDateString("es-PE"),
      students: ["Ana", "Luis", "Pedro", "María"],
    };

    renderView(res, "home.hbs", data);
  } else if (req.url === "/about") {
    const data = {
      title: "Acerca de la clase",
      courseName: "Desarrollo Web",
      teacher: "Prof. Carlos Pérez",
      date: new Date().toLocaleDateString("es-PE"),
    };

    renderView(res, "about.hbs", data);
  } else if (req.url === "/students") {
    const baseStudents = [
      { name: "Ana", grade: 18 },
      { name: "Luis", grade: 14 },
      { name: "Pedro", grade: 16 },
      { name: "María", grade: 12 },
    ];

    const students = baseStudents.map((student) => ({
      ...student,
      isTopGrade: student.grade > 15,
    }));

    const data = {
      title: "Notas de estudiantes",
      students,
    };

    renderView(res, "students.hbs", data);
  } else {
    res.statusCode = 404;
    res.end("<h1>404 - Página no encontrada</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});