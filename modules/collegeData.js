const Sequelize = require('sequelize');

// Set up Sequelize connection to your PostgreSQL database
var sequelize = new Sequelize('database', 'user', 'password', {
  host: 'host',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  query: { raw: true },
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

// Get all students
module.exports.getAllStudents = function () {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then((students) => resolve(students))
      .catch(() => reject('No students found.'));
  });
};

// Get student by student number
module.exports.getStudentByNum = function (num) {
  return new Promise(function (resolve, reject) {
    Student.findOne({ where: { studentNum: num } })
      .then((student) => {
        if (student) resolve(student);
        else reject('No student found with that number.');
      })
      .catch(() => reject('Error retrieving student.'));
  });
};

// Get students by course ID
module.exports.getStudentsByCourse = function (courseId) {
  return new Promise(function (resolve, reject) {
    Student.findAll({ where: { course: courseId } })
      .then((students) => resolve(students))
      .catch(() => reject('No students found for this course.'));
  });
};

// Get all courses
module.exports.getCourses = function () {
  return new Promise(function (resolve, reject) {
    Course.findAll()
      .then((courses) => resolve(courses))
      .catch(() => reject('No courses found.'));
  });
};

// Get course by ID
module.exports.getCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    Course.findOne({ where: { courseId: id } })
      .then((course) => {
        if (course) resolve(course);
        else reject('No course found with that ID.');
      })
      .catch(() => reject('Error retrieving course.'));
  });
};

// Add a student
module.exports.addStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    studentData.TA = studentData.TA ? true : false;

    // Replace empty fields with null
    for (let key in studentData) {
      if (studentData[key] === '') {
        studentData[key] = null;
      }
    }

    Student.create(studentData)
      .then(() => resolve())
      .catch(() => reject('Unable to add student.'));
  });
};

// Update student information
module.exports.updateStudent = function (studentData) {
  return new Promise(function (resolve, reject) {
    studentData.TA = studentData.TA ? true : false;

    // Replace empty fields with null
    for (let key in studentData) {
      if (studentData[key] === '') {
        studentData[key] = null;
      }
    }

    Student.update(studentData, { where: { studentNum: studentData.studentNum } })
      .then(() => resolve())
      .catch(() => reject('Unable to update student.'));
  });
};

// Add a course
module.exports.addCourse = function (courseData) {
  return new Promise(function (resolve, reject) {
    // Replace empty fields with null
    for (let key in courseData) {
      if (courseData[key] === '') {
        courseData[key] = null;
      }
    }

    Course.create(courseData)
      .then(() => resolve())
      .catch(() => reject('Unable to add course.'));
  });
};

// Update a course
module.exports.updateCourse = function (courseData) {
  return new Promise(function (resolve, reject) {
    // Replace empty fields with null
    for (let key in courseData) {
      if (courseData[key] === '') {
        courseData[key] = null;
      }
    }

    Course.update(courseData, { where: { courseId: courseData.courseId } })
      .then(() => resolve())
      .catch(() => reject('Unable to update course.'));
  });
};

// Delete a course by ID
module.exports.deleteCourseById = function (id) {
  return new Promise(function (resolve, reject) {
    Course.destroy({ where: { courseId: id } })
      .then(() => resolve())
      .catch(() => reject('Unable to delete course or course not found.'));
  });
};
