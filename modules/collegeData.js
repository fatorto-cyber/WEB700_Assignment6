const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// Initialize Function
module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/students.json", "utf8", (err, studentData) => {
            if (err) {
                return reject("Unable to read students.json");
            }
            fs.readFile("./data/courses.json", "utf8", (err, courseData) => {
                if (err) {
                    return reject("Unable to read courses.json");
                }
                try {
                    const students = JSON.parse(studentData);
                    const courses = JSON.parse(courseData);
                    dataCollection = new Data(students, courses);
                    resolve();
                } catch (parseError) {
                    reject("Error parsing JSON files");
                }
            });
        });
    });
};

// Retrieve all students
module.exports.getAllStudents = () => {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            return reject("Data not initialized");
        }
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("No results returned");
        }
    });
};

// Retrieve all courses
module.exports.getCourses = () => {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.courses) {
            return reject("Data not initialized");
        }
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("No results returned");
        }
    });
};

// Get student by student number
module.exports.getStudentByNum = (num) => {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            return reject("Data not initialized");
        }
        const studentNum = Number(num);
        const student = dataCollection.students.find(student => Number(student.studentNum) === studentNum);
        if (student) {
            resolve(student);
        } else {
            reject("Student not found");
        }
    });
};

// Get course by courseId
module.exports.getCourseById = (id) => {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.courses) {
            return reject("Data not initialized");
        }
        let course = dataCollection.courses.find(course => Number(course.courseId) === Number(id));
        if (course) {
            resolve(course);
        } else {
            reject("Course not found");
        }
    });
};

// Update a student by student number
module.exports.updateStudent = (studentData) => {
    return new Promise((resolve, reject) => {
        if (!dataCollection || !dataCollection.students) {
            return reject("Data not initialized");
        }
        const studentNum = Number(studentData.studentNum);
        const index = dataCollection.students.findIndex(student => Number(student.studentNum) === studentNum);

        if (index === -1) {
            return reject("Student not found");
        }
        // Update student information
        dataCollection.students[index] = { ...dataCollection.students[index], ...studentData };
        // Write the updated data back to the file
        fs.writeFile("./data/students.json", JSON.stringify(dataCollection.students, null, 2), (err) => {
            if (err) {
                return reject("Unable to save student data");
            }
            resolve();
        });
    });
};
