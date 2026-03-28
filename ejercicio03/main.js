const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

function readBody(req, callback) {
  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", () => {
    if (!body) {
      callback(null, {});
      return;
    }

    try {
      callback(null, JSON.parse(body));
    } catch (error) {
      callback(error);
    }
  });
}

function hasRequiredCreateFields(student) {
  return (
    student &&
    String(student.name || "").trim() &&
    String(student.email || "").trim() &&
    String(student.course || "").trim() &&
    String(student.phone || "").trim()
  );
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  const { method, url } = req;

  // RUTA: GET /students
  if (url === "/students" && method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify(repo.getAll()));
  }

  // RUTA: GET /students/:id
  else if (url.startsWith("/students/") && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const student = repo.getById(id);

    if (student) {
      res.statusCode = 200;
      res.end(JSON.stringify(student));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  // RUTA: POST /students
  else if (url === "/students" && method === "POST") {
    readBody(req, (error, payload) => {
      if (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON invalido" }));
        return;
      }

      if (!hasRequiredCreateFields(payload)) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: "Campos obligatorios: name, email, course, phone"
          })
        );
        return;
      }

      const newStudent = repo.create(payload);
      res.statusCode = 201;
      res.end(JSON.stringify(newStudent));
    });
  }

  // RUTA: PUT /students/:id
  else if (url.startsWith("/students/") && method === "PUT") {
    const id = parseInt(url.split("/")[2]);
    readBody(req, (error, payload) => {
      if (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON invalido" }));
        return;
      }

      const updated = repo.update(id, payload);

      if (updated) {
        res.statusCode = 200;
        res.end(JSON.stringify(updated));
      } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
      }
    });
  }

  // RUTA: POST /ListByStatus
  else if (url === "/ListByStatus" && method === "POST") {
    readBody(req, (error, payload) => {
      if (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON invalido" }));
        return;
      }

      if (!String(payload.status || "").trim()) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Debe enviar el campo status" }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify(repo.listByStatus(payload.status)));
    });
  }

  // RUTA: POST /ListByGrade
  else if (url === "/ListByGrade" && method === "POST") {
    readBody(req, (error, payload) => {
      if (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "JSON invalido" }));
        return;
      }

      const minGrade = payload.minGrade ?? payload.grade;
      if (minGrade === undefined || Number.isNaN(Number(minGrade))) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Debe enviar minGrade o grade numerico" }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify(repo.listByGrade(minGrade)));
    });
  }

  // RUTA: DELETE /students/:id
  else if (url.startsWith("/students/") && method === "DELETE") {
    const id = parseInt(url.split("/")[2]);
    const deleted = repo.remove(id);

    if (deleted) {
      res.statusCode = 200;
      res.end(JSON.stringify(deleted));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
    }
  }

  // Ruta no encontrada
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  }
});

server.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});