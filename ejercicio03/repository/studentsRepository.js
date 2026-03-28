let students = [
  {
    id: 1,
    name: "Juan Perez",
    grade: 20,
    age: 23,
    email: "juan.perez@ejemplo.com",
    phone: "+51 987654321",
    enrollmentNumber: "2025001",
    course: "Diseno y Desarrollo de Software C24",
    year: 3,
    subjects: ["Algoritmos", "Bases de Datos", "Redes"],
    gpa: 3.8,
    status: "Activo",
    admissionDate: "2022-03-01"
  },
  {
    id: 2,
    name: "Maria Lopez",
    grade: 16,
    age: 21,
    email: "maria.lopez@ejemplo.com",
    phone: "+51 912345678",
    enrollmentNumber: "2025002",
    course: "Diseno y Desarrollo de Software C24",
    year: 2,
    subjects: ["Programacion", "Estadistica"],
    gpa: 3.4,
    status: "Activo",
    admissionDate: "2023-03-01"
  },
  {
    id: 3,
    name: "Carlos Ruiz",
    grade: 12,
    age: 24,
    email: "carlos.ruiz@ejemplo.com",
    phone: "+51 976543210",
    enrollmentNumber: "2025003",
    course: "Diseno y Desarrollo de Software C24",
    year: 4,
    subjects: ["Redes", "Sistemas Operativos"],
    gpa: 2.9,
    status: "Inactivo",
    admissionDate: "2021-03-01"
  }
];

function getAll() {
  return students;
}

function getById(id) {
  return students.find(s => s.id === id);
}

function create(student) {
  student.id = students.length + 1;
  students.push(student);
  return student;
}

function update(id, updateData) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updateData };
    return students[index];
  }
  return null;
}

function remove(id) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    return students.splice(index, 1)[0];
  }
  return null;
}

function listByStatus(status) {
  return students.filter(s => String(s.status || "").toLowerCase() === String(status || "").toLowerCase());
}

function listByGrade(minGrade = 0) {
  const min = Number(minGrade);
  if (Number.isNaN(min)) {
    return [];
  }
  return students.filter(s => Number(s.grade) >= min);
}

module.exports = { getAll, getById, create, update, remove, listByStatus, listByGrade };
