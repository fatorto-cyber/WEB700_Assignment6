const Sequelize = require('sequelize');

// Set up Sequelize connection to your PostgreSQL database using the actual details
const sequelize = new Sequelize('Seneca DB Instance', 'Seneca DB Instance_owner', 'npg_QEPYNgI19Opl', {
  host: 'ep-dawn-glitter-a55h60yn-pooler.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }, // SSL connection required
  },
  query: { raw: true }, // Optional, but good for raw queries
});

// Define the Student model
const Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  addressStreet: {
    type: Sequelize.STRING,
  },
  addressCity: {
    type: Sequelize.STRING,
  },
  addressProvince: {
    type: Sequelize.STRING,
  },
  TA: {
    type: Sequelize.BOOLEAN,
  },
  status: {
    type: Sequelize.STRING,
  },
});

// Define the Course model
const Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: Sequelize.STRING,
  },
  courseDescription: {
    type: Sequelize.STRING,
  },
});

// Set up the relationship: A Course can have many Students
Course.hasMany(Student, { foreignKey: 'course' });

// Seed courses from the provided JSON data
module.exports.seedCourses = function () {
  return new Promise(function (resolve, reject) {
    const courses = [
      { courseCode: 'DES720', courseDescription: 'Relational Database Design and Implementation' },
      { courseCode: 'JAV745', courseDescription: 'Java Programming' },
      { courseCode: 'OPS705', courseDescription: 'Introduction to Cloud Computing' },
      { courseCode: 'SQL710', courseDescription: 'Database Administration and Management' },
      { courseCode: 'WEB700', courseDescription: 'Web Programming' },
      { courseCode: 'CAP805', courseDescription: 'Applied Capstone Project' },
      { courseCode: 'CJV805', courseDescription: 'Database Connectivity Using Java' },
      { courseCode: 'DBD800', courseDescription: 'Accessing Big Data' },
      { courseCode: 'DBW825', courseDescription: 'Datawarehousing' },
      { courseCode: 'SEC835', courseDescription: 'Security in Databases and Web Applications' },
      { courseCode: 'WTP100', courseDescription: 'Work Term Preparation (Work-Integrated Learning option only)' },
    ];

    Course.bulkCreate(courses)
      .then(() => resolve())
      .catch(() => reject('Unable to seed courses.'));
  });
};

// Initialize the database (syncing the tables with the models)
module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    sequelize.sync()
      .then(() => {
        return module.exports.seedCourses();
      })
      .then(() => resolve())
      .catch((error) => reject('Unable to sync the database: ' + error));
  });
};

// Fetch all students
module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    Student.findAll()
      .then((students) => {
        resolve(students);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

// Fetch students by courseId
module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        course: course
      }
    })
      .then((students) => {
        resolve(students);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

// Fetch a student by their studentNum
module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        studentNum: num
      }
    })
      .then((students) => {
        if (students.length > 0) {
          resolve(students[0]);
        } else {
          reject("No results returned");
        }
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

// Fetch all courses
module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    Course.findAll()
      .then((courses) => {
        resolve(courses);
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

// Fetch a course by its courseId
module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.findAll({
      where: {
        courseId: id
      }
    })
      .then((courses) => {
        if (courses.length > 0) {
          resolve(courses[0]);
        } else {
          reject("No results returned");
        }
      })
      .catch(() => {
        reject("No results returned");
      });
  });
};

// Add a new student
module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    // Ensure TA is explicitly set
    studentData.TA = (studentData.TA) ? true : false;

    // Replace empty string values with null
    for (let key in studentData) {
      if (studentData[key] === "") {
        studentData[key] = null;
      }
    }

    Student.create(studentData)
      .then(() => {
        resolve("Student added successfully");
      })
      .catch(() => {
        reject("Unable to create student");
      });
  });
};

// Update an existing student
module.exports.updateStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    // Ensure TA is explicitly set
    studentData.TA = (studentData.TA) ? true : false;

    // Replace empty string values with null
    for (let key in studentData) {
      if (studentData[key] === "") {
        studentData[key] = null;
      }
    }

    Student.update(studentData, {
      where: {
        studentNum: studentData.studentNum
      }
    })
      .then(() => {
        resolve("Student updated successfully");
      })
      .catch(() => {
        reject("Unable to update student");
      });
  });
};
